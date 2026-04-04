#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║       🎸 Guitar Learning App 🎸        ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check .env
if [ ! -f "$ROOT_DIR/.env" ]; then
  echo -e "${YELLOW}⚠ No .env found. Copying from env_template.txt...${NC}"
  cp "$ROOT_DIR/env_template.txt" "$ROOT_DIR/.env"
  echo -e "${YELLOW}  Edit .env and add your ANTHROPIC_API_KEY for AI features.${NC}"
fi

# ── Backend setup ──────────────────────────────────────────────
echo -e "\n${GREEN}[1/4] Setting up Python virtual environment...${NC}"
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "  Created venv"
fi

source venv/bin/activate
pip install -q -r requirements.txt
echo -e "  ${GREEN}✓ Backend dependencies installed${NC}"

# ── Frontend setup ─────────────────────────────────────────────
echo -e "\n${GREEN}[2/4] Setting up frontend dependencies...${NC}"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  npm install --silent
fi
echo -e "  ${GREEN}✓ Frontend dependencies installed${NC}"

# ── Start services ─────────────────────────────────────────────
echo -e "\n${GREEN}[3/4] Starting services...${NC}"

# Backend
cd "$BACKEND_DIR"
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo -e "  ${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to be ready
sleep 2

# Frontend
cd "$FRONTEND_DIR"
npm run dev -- --port 5173 &
FRONTEND_PID=$!
echo -e "  ${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo -e "\n${BLUE}[4/4] App is running!${NC}"
echo -e "  ${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "  ${GREEN}Backend:${NC}  http://localhost:8000"
echo -e "  ${GREEN}API Docs:${NC} http://localhost:8000/docs"
echo -e "\n  Press ${RED}Ctrl+C${NC} to stop all services\n"

# Cleanup on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down...${NC}"
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo -e "${GREEN}Done. Goodbye! 🎸${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM

wait
