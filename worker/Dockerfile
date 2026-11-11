FROM node:20-slim

RUN apt-get update && apt-get install -y \
  qpdf ghostscript imagemagick tesseract-ocr \
  mupdf-tools python3-pip python3 \
  poppler-utils img2pdf libreoffice \
  libreoffice-writer libreoffice-calc libreoffice-impress \
  && pip3 install pypdf reportlab --break-system-packages \
  && mkdir -p /root/.local/bin && ln -sf /usr/bin/img2pdf /root/.local/bin/img2pdf \
  && rm -rf /var/lib/apt/lists/*

RUN sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' \
  /etc/ImageMagick-6/policy.xml

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["node", "dist/main.js"]
