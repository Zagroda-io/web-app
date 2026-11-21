#!/usr/bin/env bash
# Podmiana web-app na środowisku — etap „Wdrożenie” joba Application_Deployer-Zagroda_WebApp
# (devops/jenkins/deploy.jenkinsfile). Działa na agencie Jenkinsa (kontener zagroda-jenkins na VM zagroda-backend,
# z gniazdem Dockera hosta).
#
# Bez przestoju i bez wycofywania: nowa wersja startuje obok starej, a ruch przechodzi na nią (alias w sieci
# zagroda-network, na który wskazuje Caddy) dopiero, gdy /api/health pokaże wdrażany commit. Jeśli nowa wersja
# nie wstanie, stara działa dalej — nie ma czego cofać.
#
# Wejście (zmienne): CONTAINER, ALIAS, API_URL, TARGET_TAG, TARGET_SHA. Linie `::nazwa::` czyta job.
set -euo pipefail

: "${CONTAINER:?}" "${ALIAS:?}" "${API_URL:?}" "${TARGET_TAG:?}" "${TARGET_SHA:?}"
REGISTRY="${REGISTRY:-europe-central2-docker.pkg.dev}"
IMAGE_PATH="${IMAGE_PATH:-project-64d85145-d47a-4fa5-b25/zagroda/web-app}"
NETWORK="${NETWORK:-zagroda-network}"
HEALTH_TIMEOUT_SEC="${HEALTH_TIMEOUT_SEC:-90}"
# metadata — token konta usługi VM; none — obraz jest już lokalnie (testy skryptu).
GAR_AUTH="${GAR_AUTH:-metadata}"

IMAGE="$REGISTRY/$IMAGE_PATH:$TARGET_TAG"
NEXT="$CONTAINER-next"
log() { printf '\n==> %s\n' "$*"; }

# Logowanie tylko na czas pobrania, w tymczasowym katalogu — token nie zostaje na maszynie.
pull() {
  [ "$GAR_AUTH" = none ] && { docker image inspect "$IMAGE" >/dev/null; return; }
  local config status=0
  config=$(mktemp -d)
  {
    curl -fsS -H 'Metadata-Flavor: Google' \
      'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token' |
      sed -E 's/.*"access_token" *: *"([^"]+)".*/\1/' |
      DOCKER_CONFIG="$config" docker login -u oauth2accesstoken --password-stdin "https://$REGISTRY" >/dev/null &&
      DOCKER_CONFIG="$config" docker pull -q "$IMAGE"
  } || status=$?
  rm -rf "$config"
  return "$status"
}

# Nowy kontener działa bez restartów, a /api/health odpowiada z wdrażanym commitem.
wait_healthy() {
  local start=$SECONDS state restarts health
  echo "Czekam na /api/health z commitem ${TARGET_SHA:0:7} (do ${HEALTH_TIMEOUT_SEC}s)"
  while ((SECONDS - start < HEALTH_TIMEOUT_SEC)); do
    read -r state restarts < <(docker inspect -f '{{.State.Status}} {{.RestartCount}}' "$NEXT" 2>/dev/null || echo 'brak 0')
    if [ "$state" != running ] || [ "$restarts" -gt 0 ]; then
      echo "Nowy kontener nie działa stabilnie (stan: $state, restarty: $restarts)." >&2
      return 1
    fi
    if health=$(docker exec "$NEXT" wget -qO- http://127.0.0.1:3000/api/health 2>/dev/null); then
      if [[ "$health" == *"\"commit\":\"$TARGET_SHA\""* ]]; then
        echo "Działa: $health"
        return 0
      fi
      echo "Odpowiada inna wersja niż oczekiwana: $health" >&2
      return 1
    fi
    sleep 2
  done
  echo "Po ${HEALTH_TIMEOUT_SEC}s /api/health nie odpowiada." >&2
  return 1
}

log "Obraz: $IMAGE"
pull

previous=""
if docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  previous=$(docker container inspect -f '{{.Config.Image}}' "$CONTAINER")
  log "Obecnie: $previous"
  echo "::previous::${previous##*:}"
fi

# Pozostałość po przerwanym wdrożeniu.
docker rm -f "$NEXT" >/dev/null 2>&1 || true

log "Start nowej wersji obok obecnej ($NEXT, API_URL=$API_URL)"
docker run -d \
  --name "$NEXT" \
  --restart unless-stopped \
  --network "$NETWORK" \
  -e API_URL="$API_URL" \
  -e TZ=Europe/Warsaw \
  --log-opt max-size=10m --log-opt max-file=3 \
  "$IMAGE" >/dev/null

if ! wait_healthy; then
  echo "Ostatnie logi nowej wersji:" >&2
  docker logs --tail 100 "$NEXT" >&2 2>&1 || true
  docker rm -f "$NEXT" >/dev/null
  echo "::result::nie-wstala"
  exit 1
fi

log "Przełączenie ruchu ($ALIAS) na nową wersję"
# Alias dostaje się przy podłączaniu do sieci — dlatego odłączenie i ponowne podłączenie z aliasem.
docker network disconnect "$NETWORK" "$NEXT"
docker network connect --alias "$ALIAS" "$NETWORK" "$NEXT"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker rename "$NEXT" "$CONTAINER"

docker image prune -af --filter "label=org.opencontainers.image.title=Zagroda — web-app" --filter "until=336h" >/dev/null 2>&1 || true
log "Wdrożono $IMAGE"
echo "::result::wdrozono"
