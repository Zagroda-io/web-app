#!/usr/bin/env bash
# Obraz web-app w Artifact Registry dla joba Application_Deployer-Zagroda_WebApp (devops/jenkins/deploy.jenkinsfile).
# Działa na agencie Jenkinsa (kontener zagroda-jenkins na VM zagroda-backend).
#
#   image.sh exists <tag>   — kod 0, gdy obraz <tag> jest w rejestrze, 3 — gdy go nie ma, 1 — błąd rejestru
#
# Rejestr: token konta usługi VM z metadata servera GCE (bez kluczy).
set -euo pipefail

REGISTRY="${REGISTRY:-europe-central2-docker.pkg.dev}"
IMAGE_PATH="${IMAGE_PATH:-project-64d85145-d47a-4fa5-b25/zagroda/web-app}"

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

case "${1:-}" in
  exists) exists "${2:?Podaj tag obrazu}" ;;
  *) echo "Użycie: $0 exists <tag>" >&2; exit 2 ;;
esac
