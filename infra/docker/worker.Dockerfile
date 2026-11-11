FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY worker/package*.json ./
RUN npm ci
COPY worker/ .
RUN npm run build

FROM node:22-bookworm-slim AS production

# Every external tool the processors call: qpdf (merge/split/rotate/pages/protect),
# ghostscript (compress), poppler-utils (pdf→img), LibreOffice (office↔pdf),
# mupdf-tools/mutool (edit), img2pdf (images→pdf), pypdf + reportlab (number pages, crop).
RUN apt-get update && apt-get install -y --no-install-recommends \
    qpdf \
    ghostscript \
    poppler-utils \
    mupdf-tools \
    img2pdf \
    python3 \
    python3-pypdf \
    python3-reportlab \
    libreoffice-writer \
    libreoffice-impress \
    libreoffice-calc \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Storage mounts
VOLUME ["/storage/uploads", "/storage/processing", "/storage/output"]

CMD ["node", "dist/main"]
