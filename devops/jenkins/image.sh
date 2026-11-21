#!/usr/bin/env bash
# Obraz web-app w Artifact Registry dla joba Application_Deployer-Zagroda_WebApp (devops/jenkins/deploy.jenkinsfile).
# Działa na agencie Jenkinsa (kontener zagroda-jenkins na VM zagroda-backend).
#
#   image.sh exists <tag>           — kod 0, gdy obraz <tag> jest w rejestrze, 3 — gdy go nie ma
#   image.sh build <commit> <tag>   — uruchamia workflow „Budowanie obrazu Docker” (na main, z polem commit=<commit>)
#                                     i czeka, aż obraz <tag> pojawi się w rejestrze
#
# Workflow zawsze startuje z main, a buduje podany commit — dzięki temu działa dla każdego commita (także ze starego
# brancha, który nie ma jeszcze workflow), a nie tylko dla końcówek branchy.
# Rejestr: token konta usługi VM z metadata servera GCE (bez kluczy). GitHub: GITHUB_TOKEN
# (poświadczenie github-web-app-actions — fine-grained token z uprawnieniem Actions: read and write).
# Linie `::nazwa::` czyta job, żeby pokazać wynik w opisie builda.
set -euo pipefail

REGISTRY="${REGISTRY:-europe-central2-docker.pkg.dev}"
IMAGE_PATH="${IMAGE_PATH:-project-64d85145-d47a-4fa5-b25/zagroda/web-app}"
GITHUB_REPO="${GITHUB_REPO:-Zagroda-io/web-app}"
WORKFLOW="${WORKFLOW:-image.yml}"
DISPATCH_REF="${DISPATCH_REF:-main}"
BUILD_TIMEOUT_SEC="${BUILD_TIMEOUT_SEC:-1800}"
POLL_SEC="${POLL_SEC:-20}"

registry_token() {
  curl -fsS -H 'Metadata-Flavor: Google' \
    'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token' |
    sed -E 's/.*"access_token" *: *"([^"]+)".*/\1/'
}

# Kod HTTP manifestu: 200 — obraz jest, 404 — nie ma.
manifest_code() {
  curl -sS -o /dev/null -w '%{http_code}' --max-time 20 \
    -H "Authorization: Bearer $(registry_token)" \
    -H 'Accept: application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json' \
    "https://$REGISTRY/v2/$IMAGE_PATH/manifests/$1"
}

exists() {
  local code
  code=$(manifest_code "$1")
  case "$code" in
    200) echo "Obraz $REGISTRY/$IMAGE_PATH:$1 jest w rejestrze."; return 0 ;;
    404) echo "Obrazu $REGISTRY/$IMAGE_PATH:$1 nie ma w rejestrze."; return 3 ;;
    *) echo "Rejestr odpowiedział $code dla $1 — sprawdź uprawnienia konta usługi VM (Artifact Registry Reader)." >&2; return 1 ;;
  esac
}

gh_api() {
  curl -sS --max-time 30 -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' "$@"
}

# Pierwsze wystąpienie pola tekstowego/liczbowego w JSON-ie (bez jq — nie ma go w obrazie Jenkinsa).
json_field() {
  grep -o "\"$1\": *\"\{0,1\}[^\",}]*" | head -n 1 | sed -E "s/\"$1\": *\"?//"
}

build() {
  local commit="$1" tag="$2" response code run_id run_url status conclusion start elapsed
  : "${GITHUB_TOKEN:?Brak GITHUB_TOKEN (poświadczenie github-web-app-actions)}"
  response=$(mktemp)
  code=$(gh_api -o "$response" -w '%{http_code}' -X POST \
    --data "$(printf '{"ref":"%s","inputs":{"commit":"%s"},"return_run_details":true}' "$DISPATCH_REF" "$commit")" \
    "https://api.github.com/repos/$GITHUB_REPO/actions/workflows/$WORKFLOW/dispatches")
  case "$code" in
    200 | 204) ;;
    401 | 403) echo "GitHub odrzucił token ($code) — poświadczenie github-web-app-actions potrzebuje Actions: read and write w $GITHUB_REPO." >&2; cat "$response" >&2; return 1 ;;
    404) echo "GitHub nie widzi workflow $WORKFLOW na $DISPATCH_REF (404) — czy token ma dostęp do repo $GITHUB_REPO?" >&2; return 1 ;;
    *) echo "GitHub odpowiedział $code:" >&2; cat "$response" >&2; return 1 ;;
  esac
  run_id=$(json_field workflow_run_id <"$response" || true)
  run_url=$(json_field html_url <"$response" || true)
  [ -n "$run_url" ] || run_url="https://github.com/$GITHUB_REPO/actions/workflows/$WORKFLOW"
  echo "Zlecono build obrazu $tag (commit $commit): $run_url"
  echo "::run::$run_url"

  start=$(date +%s)
  while true; do
    elapsed=$(($(date +%s) - start))
    if [ -n "$run_id" ]; then
      gh_api -o "$response" "https://api.github.com/repos/$GITHUB_REPO/actions/runs/$run_id" >/dev/null
      status=$(json_field status <"$response" || true)
      conclusion=$(json_field conclusion <"$response" || true)
      printf '[%4ds] workflow: %s%s\n' "$elapsed" "${status:-?}" "${conclusion:+ / $conclusion}"
      if [ "$status" = completed ] && [ "$conclusion" != success ]; then
        echo "Build obrazu zakończył się: $conclusion — szczegóły: $run_url" >&2
        return 1
      fi
    else
      printf '[%4ds] czekam na obraz %s\n' "$elapsed" "$tag"
    fi
    if [ "$(manifest_code "$tag")" = 200 ]; then
      echo "Obraz $tag jest w rejestrze."
      return 0
    fi
    if [ "${status:-}" = completed ]; then
      echo "Workflow zakończył się sukcesem, ale obrazu $tag nie ma w rejestrze — szczegóły: $run_url" >&2
      return 1
    fi
    if [ "$elapsed" -ge "$BUILD_TIMEOUT_SEC" ]; then
      echo "Po ${BUILD_TIMEOUT_SEC}s nie ma obrazu $tag — sprawdź build: $run_url" >&2
      return 1
    fi
    sleep "$POLL_SEC"
  done
}

case "${1:-}" in
  exists) exists "${2:?Podaj tag obrazu}" ;;
  build) build "${2:?Podaj commit}" "${3:?Podaj tag obrazu}" ;;
  *) echo "Użycie: $0 exists <tag> | build <commit> <tag>" >&2; exit 2 ;;
esac
