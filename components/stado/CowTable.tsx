import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { CowTableRow } from './CowTableRow'
import type { Cow, CowStatusFilter } from '@/lib/types/stado.types'

interface CowTableProps {
  cows: Cow[]
  isLoading?: boolean
  searchQuery: string
  statusFilter: CowStatusFilter
  onRowClick: (cowId: number) => void
}

export function CowTable({
  cows,
  isLoading,
  searchQuery,
  statusFilter,
  onRowClick,
}: CowTableProps) {
  const filteredCows = useMemo(() => {
    return cows.filter((cow) => {
      const matchesSearch =
        cow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cow.earTagNumber.includes(searchQuery) ||
        cow.id.toString().includes(searchQuery)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'alert' && cow.status === 'alert') ||
        (statusFilter === 'warn' && cow.status === 'warn') ||
        (statusFilter === 'ok' && cow.status === 'ok')

      return matchesSearch && matchesStatus
    })
  }, [cows, searchQuery, statusFilter])

  return (
    <Card className="overflow-hidden py-0" size="sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="whitespace-nowrap">Numer / Imię</TableHead>
              <TableHead className="whitespace-nowrap">Kolczyk</TableHead>
              <TableHead>Rasa</TableHead>
              <TableHead>Wiek</TableHead>
              <TableHead>Laktacja</TableHead>
              <TableHead>BCS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="whitespace-nowrap">Ostatni alert</TableHead>
              <TableHead className="w-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredCows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  Brak krów spełniających kryteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCows.map((cow) => (
                <CowTableRow key={cow.id} cow={cow} onClick={onRowClick} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
