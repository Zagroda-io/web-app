'use client'

import dynamic from 'next/dynamic'
import { CowProfileTopbar } from './CowProfileTopbar'
import { CowIdCard } from './CowIdCard'
import { CowActiveAlerts } from './CowActiveAlerts'
import { CowPedigree } from './CowPedigree'
import { CowOffspring } from './CowOffspring'
import { CowBcsDisplay } from './CowBcsDisplay'
import { CowEventTimeline } from './CowEventTimeline'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cow } from '@/lib/types/stado.types'

// Dynamic imports for Recharts components
const CowYieldChart = dynamic(() => import('./CowYieldChart'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[160px] w-full mb-4" />
})
const CowActivityChart = dynamic(() => import('./CowActivityChart'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[150px] w-full" />
})

interface CowProfileProps {
  cow: Cow | null
  isLoading: boolean
  onBack: () => void
  onCowClick: (id: number) => void
}

export function CowProfile({ cow, isLoading, onBack, onCowClick }: CowProfileProps) {
  if (isLoading || !cow) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  const handlePlayClip = (eventId: string) => {
    console.log('Odtwarzanie klipu dla zdarzenia:', eventId)
    // Implementacja Dialogu z wideo w StadoView lub tutaj
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <CowProfileTopbar 
        cow={cow} 
        onBack={onBack} 
        onEdit={() => console.log('Edytuj')} 
        onAddEvent={() => console.log('Dodaj zdarzenie')} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Lewa kolumna */}
        <div className="flex flex-col gap-4">
          <CowIdCard cow={cow} />
          <CowActiveAlerts alerts={cow.activeAlerts} />
          <CowPedigree sire={cow.sire} dam={cow.dam} onCowClick={onCowClick} />
          <CowOffspring offspring={cow.offspring} onCowClick={onCowClick} />
        </div>

        {/* Prawa kolumna */}
        <div className="flex flex-col gap-4">
          <CowYieldChart yieldHistory={cow.yieldHistory} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CowActivityChart activityHistory={cow.activityHistory} />
            <CowBcsDisplay bcs={cow.bcs} />
          </div>

          <CowEventTimeline events={cow.events} onPlayClip={handlePlayClip} />
        </div>
      </div>
    </div>
  )
}
