# Wydania i wdrożenia web-app

| Co | Gdzie |
| --- | --- |
| BPPR — lint, typy, testy, build (bez Dockera) | `.github/workflows/bppr.yml` |
| PR do `release/**` tylko z `main` | `.github/workflows/release-pr.yml` |
| Obrazy, tagi wydań, wydania na GitHubie | `.github/workflows/image.yml` |
| Obraz | `Dockerfile` (Next.js `output: "standalone"`) |
| Job `Application_Deployer-Zagroda_WebApp` | `devops/jenkins/deploy.jenkinsfile` |
| Sprawdzenie obrazu w rejestrze i zlecenie builda w GitHubie | `devops/jenkins/image.sh` |
| Różnice środowisko ↔ wersja | `devops/jenkins/diff.sh` |
| Podmiana kontenera | `devops/jenkins/deploy.sh` |

## Przepływ

```
feature/… ──PR + BPPR──▶ main ──PR (bez BPPR)──▶ release/…
                          │                         │
                 push: obraz dev-latest,     Run workflow (patch/minor/major):
                 main, sha-<commit>          BPPR → obraz X.Y.Z → tag vX.Y.Z
                          │                         │
                          ▼                         ▼
                 DEV: tag, branch, commit    PROD: tylko tag vX.Y.Z
                 (brak obrazu → build)       (gotowy obraz, po zatwierdzeniu)
```

- **PR do `main`** (z `feature/…`, `claude/…` itd.) → **BPPR**: `npm run lint`, `npm run typecheck`, `npm test`,
  `npm run build`. Merge dopiero po zielonym BPPR (reguła brancha poniżej).
- **Merge do `main`** → BPPR na wyniku merge'a → obraz `dev-latest`, `main`, `sha-<commit>`. Nic się samo nie wdraża.
- **`release/…`** (nazwa dowolna, np. `release/1.0`) powstaje tylko z `main` i dostaje kod tylko PR-em z `main`
  (check „Źródło PR”). BPPR się tam nie uruchamia — ten kod przeszedł go w drodze do `main`.
- **Wydanie** — zawsze ręcznie: **Actions → Budowanie obrazu Docker → Run workflow**, branch `release/…`, podbicie
  **patch**, **minor** albo **major**. Workflow sprawdza, że branch ma wyłącznie commity z `main`, puszcza BPPR, buduje
  obraz `X.Y.Z` i `sha-<commit>` (`latest`, gdy to najwyższa wersja), a na końcu zakłada tag `vX.Y.Z` i wydanie na
  GitHubie. Tag powstaje dopiero po wysłaniu obrazu, więc każdy tag ma obraz. Ponowne uruchomienie na commicie, który
  ma już tag, tylko odtwarza obraz tej wersji.
- **Build dev** — Run workflow na dowolnym branchu (obraz `sha-<commit>` jego ostatniego commita) albo na `main` z polem
  **commit** (obraz `sha-<commit>` tego commita). Tak zleca obraz Jenkins.

Ten sam obraz działa na DEV i PROD: adres API nie jest wpisany w build, tylko podawany przy starcie kontenera
(`API_URL`; przeglądarka dostaje go z `/runtime-config.js` — opis w `lib/config.ts`). Wersja i commit obrazu są w
`/api/health`, np. `{"status":"UP","version":"1.0.0","commit":"…"}`.

## Job `Application_Deployer-Zagroda_WebApp`

| Parametr | DEV (`app.dev.zagroda.io`) | PROD (`app.zagroda.io`) |
| --- | --- | --- |
| `SOURCE=TAG`, `REF=v1.0.0` | ✅ obraz `1.0.0` | ✅ obraz `1.0.0`, po kliknięciu **Wdróż** |
| `SOURCE=BRANCH`, `REF=feature/…` | ✅ obraz `sha-<końcówka brancha>` | ❌ |
| `SOURCE=COMMIT`, `REF=abc1234` | ✅ obraz `sha-abc1234` | ❌ |
| Brak obrazu w rejestrze | job uruchamia build w GitHubie i czeka | błąd — PROD wdraża tylko gotowe obrazy |

Etapy: **Przygotowanie** (commit z tagu/brancha/SHA) → **Obraz** → **Różnice** (commity, które wejdą albo znikną) →
**Zatwierdzenie** (PROD) → **Wdrożenie** → **Smoke test** (`/api/health` i `/runtime-config.js` przez Caddy).

Wdrożenie jest bez przestoju: nowy kontener startuje obok starego, a ruch przechodzi na niego dopiero, gdy `/api/health`
pokaże wdrażany commit. Jeśli nowa wersja nie wstanie, stara działa dalej. **Cofnięcie wersji** = job z poprzednim tagiem.

Środowiska (kontener, alias dla Caddy, `API_URL`, adres publiczny) są w mapie `ENVIRONMENTS` na początku
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

1. **Poświadczenie `github-web-app-actions`** (Secret text) — fine-grained token, Resource owner `Zagroda-io`,
   **Only select repositories** → `web-app`, **Repository permissions → Actions: Read and write** (nic więcej).
   Może to być ten sam token co `github-core-api-actions`, jeśli dodasz mu repo `web-app`.
2. **Poświadczenie `zagroda-web-app`** (Username with password) — odczyt repo `web-app` (job pobiera nim historię i tagi).
3. **Job:** New Item → Pipeline, nazwa `Application_Deployer-Zagroda_WebApp`, Pipeline script from SCM, repo
   `https://github.com/Zagroda-io/web-app.git`, poświadczenie `zagroda-web-app`, branch `*/main`, Script Path
   `devops/jenkins/deploy.jenkinsfile`. Raz **Build Now** — wczyta parametry.

### Domeny i Caddy

Rekordy DNS `app.dev.zagroda.io` i `app.zagroda.io` → `zagroda-backend` (34.118.118.87) oraz wpisy w
`common/devops/configuration/production/Caddyfile` (job `Application_Deployer-Caddy`, `ENVIRONMENT=production`):

```
app.dev.zagroda.io {
	reverse_proxy web-app-dev:3000
}

app.zagroda.io {
	reverse_proxy web-app:3000
}
```

core-api ma już te adresy w `CORS_ALLOWED_ORIGINS`. Pierwsze wdrożenie: job z `ENVIRONMENT=DEV`, `SOURCE=BRANCH`,
`REF=main` — do czasu wpisu w Caddy etap Smoke test będzie żółty.
