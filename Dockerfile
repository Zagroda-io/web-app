# Zagroda web-app: Next.js jako samodzielny serwer (output: "standalone" w next.config.mjs).
# Obraz nie zależy od środowiska — adres API podaje się przy starcie kontenera (API_URL, opis w lib/config.ts).
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:26-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Ustawiane przez CI (workflow „Budowanie obrazu Docker”); widoczne w /api/health.
ARG APP_VERSION=dev
ARG GIT_SHA=
ENV APP_VERSION=$APP_VERSION GIT_SHA=$GIT_SHA
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO /dev/null http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
