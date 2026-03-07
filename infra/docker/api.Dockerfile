FROM node:20-alpine AS builder

WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api/ .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
