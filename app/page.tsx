import { ModeToggle } from "@/components/mode-toggle"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Zagroda</h1>
        <p className="text-muted-foreground mt-2">Zapraszamy do panelu sterowania.</p>
        <a href="/dashboard" className="inline-block mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Przejdź do Dashboardu
        </a>
      </div>
    </div>
  )
}
