#!/bin/bash

# TrendyCart Backend Server Startup Script
# This script starts the backend server and can run in background

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="/Users/manogarshanmugam/projects/Trendycartwebsite/Trendycartwebsite/backend"
PORT=5005
LOGFILE="$BACKEND_DIR/server.log"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if server is already running
check_server() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Server is running
    else
        return 1  # Server is not running
    fi
}

# Kill existing server process
kill_existing_server() {
    print_warning "Killing existing server on port $PORT..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Start the server
start_server() {
    print_status "Starting TrendyCart Backend Server..."
    
    # Change to backend directory
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if server.js exists
    if [ ! -f "server.js" ]; then
        print_error "server.js not found in $BACKEND_DIR"
        exit 1
    fi
    
    # Export environment variables
    export PORT=$PORT
    export NODE_ENV=development
    
    # Check if running as background process
    if [ "$1" = "--background" ] || [ "$1" = "-b" ]; then
        print_status "Starting server in background mode..."
        print_status "Logs will be written to: $LOGFILE"
        
        # Start server in background and redirect output to log file
        nohup node server.js > "$LOGFILE" 2>&1 &
        SERVER_PID=$!
        
        # Wait a moment and check if server started successfully
        sleep 3
        if check_server; then
            print_status "✅ Server started successfully in background!"
            print_status "🚀 Server PID: $SERVER_PID"
            print_status "🌍 Server URL: http://localhost:$PORT"
            print_status "📋 Log file: $LOGFILE"
            echo "$SERVER_PID" > "$BACKEND_DIR/server.pid"
        else
            print_error "❌ Failed to start server in background"
            exit 1
        fi
    else
        print_status "Starting server in foreground mode..."
        print_status "🚀 Server URL: http://localhost:$PORT"
        print_status "Press Ctrl+C to stop the server"
        
        # Start server in foreground
        node server.js
    fi
}

# Main execution
main() {
    print_status "🔧 TrendyCart Backend Server Management"
    
    # Check if server is already running
    if check_server; then
        print_warning "Server is already running on port $PORT"
        read -p "Do you want to restart it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_existing_server
        else
            print_status "Server is already running at http://localhost:$PORT"
            exit 0
        fi
    fi
    
    # Start the server
    start_server "$1"
}

# Handle script arguments
case "$1" in
    --help|-h)
        echo "TrendyCart Backend Server Startup Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --background, -b    Start server in background mode"
        echo "  --help, -h          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                  Start server in foreground"
        echo "  $0 --background     Start server in background"
        echo ""
        exit 0
        ;;
    *)
        main "$1"
        ;;
esac
