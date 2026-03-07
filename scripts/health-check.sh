#!/usr/bin/env bash
API_URL=${API_URL:-"http://localhost:3001/api/v1"}

echo "=== PDF Platform Health Check ==="
echo ""

# API Health
echo -n "API health: "
RESPONSE=$(curl -sf "$API_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "✅ OK"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
  echo "❌ UNREACHABLE ($API_URL/health)"
fi

echo ""

# Redis
echo -n "Redis: "
if redis-cli ping > /dev/null 2>&1; then
  echo "✅ OK"
else
  echo "❌ UNREACHABLE"
fi

echo ""

# System tools
echo "System tools:"
for tool in qpdf gs convert; do
  if command -v $tool &> /dev/null; then
    VERSION=$(${tool} --version 2>&1 | head -1)
    echo "  ✅ $tool: $VERSION"
  else
    echo "  ❌ $tool: NOT FOUND"
  fi
done
