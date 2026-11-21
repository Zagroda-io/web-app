# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## CI/CD

- **BPPR** (`.github/workflows/bppr.yml`) — każdy PR do `main`: lint, typy, testy, build. Lokalnie to samo:
  `npm run lint && npm run typecheck && npm test && npm run build`.
- **DEV** (`app.dev.zagroda.io`) — Vercel, buduje się sam z `main`.
- **Budowanie obrazu Docker** (`.github/workflows/image.yml`) — obraz do Artifact Registry w GCP: automatycznie z `main`,
  ręcznie z `release/…` (wydanie `vX.Y.Z`) albo z dowolnego brancha (build dev).
- **PROD** (`app.zagroda.io`) — job `Application_Deployer-Zagroda_WebApp` w Jenkinsie, tylko z tagu wydania.

Adres API podaje się przy starcie kontenera (`API_URL`), nie przy buildzie — opis w `lib/config.ts`.
Szczegóły i konfiguracja: [`devops/jenkins/README.md`](devops/jenkins/README.md).
