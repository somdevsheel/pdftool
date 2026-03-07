FROM node:20-bookworm AS builder

# Install system PDF tools
RUN apt-get update && apt-get install -y \
    qpdf \
    ghostscript \
    imagemagick \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY worker/package*.json ./
RUN npm ci
COPY worker/ .
RUN npm run build

FROM node:20-bookworm AS production

# Install system PDF tools
RUN apt-get update && apt-get install -y \
    qpdf \
    ghostscript \
    imagemagick \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Storage mounts
VOLUME ["/storage/uploads", "/storage/processing", "/storage/output"]

CMD ["node", "dist/main"]
