#!/bin/bash
# Simple background server starter
BACKEND_DIR="/Users/manogarshanmugam/projects/Trendycartwebsite/Trendycartwebsite/backend"
PORT=5005

echo "🚀 Starting TrendyCart Backend Server in background..."

# Kill any existing process
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 1

# Change to backend directory
cd "$BACKEND_DIR"

# Start server in background
export PORT=$PORT
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

# Save PID for later reference
echo $SERVER_PID > server.pid

# Wait and verify
sleep 2
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Server started successfully!"
    echo "🌍 Server running at: http://localhost:$PORT"
    echo "📋 PID: $SERVER_PID (saved to server.pid)"
    echo "📋 Logs: server.log"
else
    echo "❌ Failed to start server"
    exit 1
fi
