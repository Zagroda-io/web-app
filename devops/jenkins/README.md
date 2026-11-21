# Wydania i wdrożenia web-app

| Środowisko | Adres | Gdzie działa | Jak trafia tam kod |
| --- | --- | --- | --- |
| DEV | `app.dev.zagroda.io` | Vercel | Vercel buduje sam z `main` (integracja z GitHubem, `vercel.json`) |
| PROD | `app.zagroda.io` | VM `zagroda-backend`, kontener `zagroda-web-app` | wydanie `vX.Y.Z` → job `Application_Deployer-Zagroda_WebApp` |

| Co | Gdzie |
| --- | --- |
| BPPR — lint, typy, testy, build (bez Dockera) | `.github/workflows/bppr.yml` |
| PR do `release/**` tylko z `main` | `.github/workflows/release-pr.yml` |
| Obrazy, tagi wydań, wydania na GitHubie | `.github/workflows/image.yml` |
| Obraz | `Dockerfile` (Next.js `output: "standalone"`) |
| Job `Application_Deployer-Zagroda_WebApp` | `devops/jenkins/deploy.jenkinsfile` |
| Sprawdzenie obrazu w rejestrze | `devops/jenkins/image.sh` |
| Różnice PROD ↔ wydanie | `devops/jenkins/diff.sh` |
| Podmiana kontenera | `devops/jenkins/deploy.sh` |

## Przepływ

```
feature/… ──PR + BPPR──▶ main ──PR (bez BPPR)──▶ release/…
                          │                         │
                 Vercel: DEV                 Run workflow (patch/minor/major):
                 (app.dev.zagroda.io)        BPPR → obraz X.Y.Z → tag vX.Y.Z
                          │                         │
                 push: obraz dev-latest,            ▼
                 main, sha-<commit>          Jenkins: PROD z tagu vX.Y.Z
                                             (gotowy obraz, po zatwierdzeniu)
```

- **PR do `main`** (z `feature/…`, `claude/…` itd.) → **BPPR**: `npm run lint`, `npm run typecheck`, `npm test`,
  `npm run build`. Merge dopiero po zielonym BPPR (reguła brancha poniżej).
- **Merge do `main`** → Vercel wdraża DEV. Równolegle workflow obrazu: BPPR na wyniku merge'a → obraz `dev-latest`,
  `main`, `sha-<commit>` (sprawdzenie, że obraz się buduje; na PROD nie trafia).
- **`release/…`** (nazwa dowolna, np. `release/1.0`) powstaje tylko z `main` i dostaje kod tylko PR-em z `main`
  (check „Źródło PR”). BPPR się tam nie uruchamia — ten kod przeszedł go w drodze do `main`.
- **Wydanie** — zawsze ręcznie: **Actions → Budowanie obrazu Docker → Run workflow**, branch `release/…`, podbicie
  **patch**, **minor** albo **major**. Workflow sprawdza, że branch ma wyłącznie commity z `main`, puszcza BPPR, buduje
  obraz `X.Y.Z` i `sha-<commit>` (`latest`, gdy to najwyższa wersja), a na końcu zakłada tag `vX.Y.Z` i wydanie na
  GitHubie. Tag powstaje dopiero po wysłaniu obrazu, więc każdy tag ma obraz. Ponowne uruchomienie na commicie, który
  ma już tag, tylko odtwarza obraz tej wersji.
- **Wdrożenie PROD** — job `Application_Deployer-Zagroda_WebApp`, parametr `TAG=v1.0.0`. Job niczego nie buduje: brak
  obrazu `1.0.0` w rejestrze = błąd.

Adres API nie jest wpisany w build, tylko podawany przy starcie kontenera (`API_URL`; przeglądarka dostaje go z
`/runtime-config.js` — opis w `lib/config.ts`). Na Vercelu działa tak samo, z `NEXT_PUBLIC_API_URL` ustawionym w
projekcie Vercela. Wersja i commit obrazu są w `/api/health`, np. `{"status":"UP","version":"1.0.0","commit":"…"}`.

## Job `Application_Deployer-Zagroda_WebApp`

Etapy: **Przygotowanie** (commit z tagu) → **Obraz** (czy `X.Y.Z` jest w rejestrze) → **Różnice** (commity, które wejdą
albo znikną) → **Zatwierdzenie** (kliknięcie **Wdróż**) → **Wdrożenie** → **Smoke test** (`/api/health` i
`/runtime-config.js` przez Caddy).

Wdrożenie jest bez przestoju: nowy kontener startuje obok starego, a ruch przechodzi na niego dopiero, gdy `/api/health`
pokaże commit wydania. Jeśli nowa wersja nie wstanie, stara działa dalej. **Cofnięcie wersji** = job z poprzednim tagiem.

Ustawienia PROD (kontener, alias dla Caddy, `API_URL`, adres publiczny) są w mapie `PROD` na początku
`deploy.jenkinsfile`.

## Konfiguracja (raz)

### GCP

Obraz trafia do repozytorium Artifact Registry `zagroda` (to samo co core-api) jako `web-app`. Konto
`github-image-push` ma już tam rolę **Artifact Registry Writer**, a VM `zagroda-backend` — **Reader**. Trzeba tylko
wpuścić repo `Zagroda-io/web-app` do Workload Identity:

```bash
PROJECT_ID=project-64d85145-d47a-4fa5-b25
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "github-image-push@$PROJECT_ID.iam.gserviceaccount.com" \
  --project="$PROJECT_ID" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/Zagroda-io/web-app"
```

### GitHub (repo `web-app`)

1. **Settings → Secrets and variables → Actions → Variables:** `GCP_WIF_PROVIDER` i `GCP_SERVICE_ACCOUNT` — te same
   wartości co w `core-api`. Opcjonalnie `GCP_PROJECT_ID`, `GAR_LOCATION`, `GAR_REPOSITORY`, `GAR_IMAGE`.
2. **Settings → Rules → Rulesets:**
   - `main`: wymagany PR, wymagany status check **BPPR**, bez force-push i usuwania;
   - `release/**`: wymagany PR, wymagany status check **Źródło PR**, bez force-push i usuwania, **Restrict creations**
     (branch zakłada tylko administrator — z `main`);
   - tagi `v*`: bez usuwania i nadpisywania — tag ma zostać przy commicie, z którego zbudowano obraz.

### Jenkins

1. **Poświadczenie `zagroda-web-app`** (Username with password) — odczyt repo `web-app` (job pobiera nim historię i tagi).
2. **Job:** New Item → Pipeline, nazwa `Application_Deployer-Zagroda_WebApp`, Pipeline script from SCM, repo
   `https://github.com/Zagroda-io/web-app.git`, poświadczenie `zagroda-web-app`, branch `*/main`, Script Path
   `devops/jenkins/deploy.jenkinsfile`. Raz **Build Now** — wczyta parametry.

### Domena i Caddy

1. Rekord DNS **A** `app.zagroda.io` → `34.118.118.87` (`zagroda-backend`). `app.dev.zagroda.io` zostaje jako CNAME
   na Vercela.
2. Wpis w `common/devops/configuration/production/Caddyfile` (job `Application_Deployer-Caddy`,
   `ENVIRONMENT=production`) — Caddy sam pobierze certyfikat, gdy DNS już wskazuje na VM:

   ```
   app.zagroda.io {
   	reverse_proxy web-app:3000
   }
   ```

core-api ma już `https://app.zagroda.io` w `CORS_ALLOWED_ORIGINS` i jako `WEB_APP_URL` (link w mailach).

### Pierwsze wdrożenie

1. PR `main` → `release/1.0` (albo załóż `release/1.0` z `main`), potem **Run workflow** na `release/1.0` → `v0.0.1`
   (albo `minor`/`major`, jeśli wolisz zacząć od `v0.1.0`/`v1.0.0`).
2. Job `Application_Deployer-Zagroda_WebApp` z `TAG=v0.0.1`. Do czasu DNS i wpisu w Caddy etap Smoke test będzie żółty.
