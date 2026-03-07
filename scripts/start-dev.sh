#!/usr/bin/env bash
set -e

echo "============================================"
echo " PDF Platform - Dev Startup"
echo "============================================"

# Ensure storage dirs exist
mkdir -p storage/uploads storage/processing storage/output
echo "✅ Storage directories ready"

# Start Redis if not running
if ! redis-cli ping > /dev/null 2>&1; then
  echo "Starting Redis..."
  redis-server --daemonize yes
  sleep 1
fi
echo "✅ Redis running"

# Install API deps
echo ""
echo "Installing API dependencies..."
cd api && npm install && cd ..
echo "✅ API deps installed"

# Install Worker deps
echo ""
echo "Installing Worker dependencies..."
cd worker && npm install && cd ..
echo "✅ Worker deps installed"

# Check system tools
echo ""
echo "Checking system tools:"
for tool in qpdf gs convert; do
  if command -v $tool &> /dev/null; then
    echo "  ✅ $tool"
  else
    echo "  ❌ $tool (NOT FOUND - install with apt/brew)"
  fi
done

echo ""
echo "============================================"
echo "Starting services..."
echo "============================================"

# Start API in background
cd api && npm run start:dev &
API_PID=$!
echo "🚀 API started (PID: $API_PID)"

# Start Worker in background  
cd worker && npm run start:dev &
WORKER_PID=$!
echo "⚙️  Worker started (PID: $WORKER_PID)"

# Install Web deps
echo ""
echo "Installing Web dependencies..."
cd web && npm install && cd ..
echo "✅ Web deps installed"

# Start Next.js
cd web && npm run dev &
WEB_PID=$!
echo "🌐 Web started (PID: $WEB_PID)"

echo ""
echo "Services running:"
echo "  Web:    http://localhost:3000"
echo "  API:    http://localhost:3001/api/v1"
echo "  Health: http://localhost:3001/api/v1/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and cleanup
trap "echo 'Stopping...'; kill $API_PID $WORKER_PID 2>/dev/null; exit 0" INT TERM
wait
