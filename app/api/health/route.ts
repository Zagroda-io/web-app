// Stan aplikacji dla wdrożenia (devops/jenkins): wersja i commit obrazu. APP_VERSION i GIT_SHA ustawia
// workflow „Budowanie obrazu Docker” przy buildzie obrazu (Dockerfile).
export const dynamic = "force-dynamic"

export function GET() {
  return Response.json(
    {
      status: "UP",
      version: process.env.APP_VERSION || "dev",
      commit: process.env.GIT_SHA || "",
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
