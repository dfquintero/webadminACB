# syntax=docker/dockerfile:1
FROM node:24.16.0-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/bff/package.json apps/bff/
COPY packages/contracts/package.json packages/contracts/
RUN npm ci --ignore-scripts

FROM deps AS build
COPY packages/contracts packages/contracts
COPY apps/bff apps/bff
RUN npm run build --workspace @acb/contracts && npm run build --workspace @acb/bff

FROM node:24.16.0-bookworm-slim AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/bff/package.json apps/bff/
COPY packages/contracts/package.json packages/contracts/
RUN npm install --omit=dev --ignore-scripts --workspace @acb/bff --workspace @acb/contracts --include-workspace-root=false

FROM node:24.16.0-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/packages/contracts/dist packages/contracts/dist
COPY packages/contracts/package.json packages/contracts/
COPY apps/bff/package.json apps/bff/
COPY --from=build /app/apps/bff/dist apps/bff/dist
USER node
EXPOSE 3001
CMD ["node", "apps/bff/dist/server.js"]
