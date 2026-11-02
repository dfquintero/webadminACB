# syntax=docker/dockerfile:1
FROM node:24.16.0-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/bff/package.json apps/bff/
COPY packages/contracts/package.json packages/contracts/
RUN npm ci --ignore-scripts

FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY packages/contracts packages/contracts
COPY apps/web apps/web
RUN npm run build --workspace @acb/contracts && npm run build --workspace @acb/web

FROM node:24.16.0-bookworm-slim AS runtime
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build /app/apps/web/.next/standalone .
COPY --from=build /app/apps/web/.next/static apps/web/.next/static
COPY --from=build /app/apps/web/public apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
