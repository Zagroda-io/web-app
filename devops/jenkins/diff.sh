#!/usr/bin/env bash
# Różnice między wersją na środowisku a wersją do wdrożenia — etap „Różnice” joba Application_Deployer-Zagroda_WebApp
# (devops/jenkins/deploy.jenkinsfile). Działa na agencie Jenkinsa, w repo z pełną historią. Niczego nie zmienia.
#
# Wejście (zmienne): ENV_NAME, CONTAINER, TARGET_TAG, TARGET_SHA. Linie `::nazwa::` czyta job.
set -euo pipefail

: "${ENV_NAME:?}" "${CONTAINER:?}" "${TARGET_TAG:?}" "${TARGET_SHA:?}"

line() { printf '%s\n' "------------------------------------------------------------------------"; }
commits() { git log --no-merges --format='  %h %ad %<(18,trunc)%an %s' --date=short "$1" | head -n 100; }

current_tag="" current_sha=""
if docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  image_id=$(docker container inspect -f '{{.Image}}' "$CONTAINER")
  current_tag=$(docker container inspect -f '{{.Config.Image}}' "$CONTAINER")
  current_tag="${current_tag##*:}"
  current_sha=$(docker image inspect -f '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image_id" 2>/dev/null || true)
  if [ "$current_sha" = "<no value>" ]; then current_sha=""; fi
fi
echo "::current_tag::$current_tag"
echo "::current_sha::${current_sha:0:7}"

echo "==================== RÓŻNICE: web-app na $ENV_NAME ===================="
printf '  Obecnie:  %s (%s)\n' "${current_tag:-brak kontenera $CONTAINER}" "${current_sha:0:7}"
printf '  Docelowo: %s (%s)\n' "$TARGET_TAG" "${TARGET_SHA:0:7}"
line

if [ -z "$current_tag" ]; then
  echo "Na $ENV_NAME nie działa jeszcze web-app — pierwsze wdrożenie."
  echo "::first::true"
  exit 0
fi
if [ -z "$current_sha" ] || ! git cat-file -e "$current_sha^{commit}" 2>/dev/null; then
  echo "Nie wiadomo, z którego commita jest obecny obraz (albo commitu nie ma już w repo) — bez listy zmian."
  echo "::unknown::true"
  exit 0
fi
if [ "$current_sha" = "$TARGET_SHA" ]; then
  echo "Ten sam commit co na środowisku — wdrożenie tylko odtworzy kontener."
  echo "::same::true"
  exit 0
fi

added=$(git rev-list --count "$current_sha..$TARGET_SHA")
removed=$(git rev-list --count "$TARGET_SHA..$current_sha")
echo "::commits::$added"
echo "::removed::$removed"
if [ "$added" -gt 0 ]; then
  echo "Commity, które wejdą ($added):"
  commits "$current_sha..$TARGET_SHA"
  line
fi
if [ "$removed" -gt 0 ]; then
  echo "UWAGA: commity, które ZNIKNĄ ze środowiska ($removed) — cofnięcie wersji albo inny branch:"
  commits "$TARGET_SHA..$current_sha"
  line
fi
echo "Zmienione pliki: $(git diff --shortstat "$current_sha" "$TARGET_SHA")"
