FROM node:22-alpine AS builder

WORKDIR /app
COPY web/package*.json ./
RUN npm ci
COPY web/ .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are baked into the browser bundle at build time, so the API
# URL must be one the user's browser can reach (not an internal Docker hostname).
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
