FROM node:14-alpine AS base
WORKDIR /app

FROM base AS build
WORKDIR /build
COPY . .
RUN yarn
RUN yarn build

FROM base AS final
WORKDIR /app
COPY --from=build /build/dist .
COPY --from=build /build/.env .
COPY --from=build /build/node_modules ./node_modules
ENTRYPOINT [ "node", "index.js" ]
