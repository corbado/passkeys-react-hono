#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to handle termination
cleanup() {
  echo -e "\nStopping all processes..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  exit 0
}

# Trap SIGINT and SIGTERM to run the cleanup function
trap cleanup SIGINT SIGTERM

# Start the backend
(cd backend && npm run dev) | while IFS= read -r line; do
  echo -e "[BACKEND] $line"
done &
BACKEND_PID=$!

# Start the frontend
(cd frontend && npm run dev) | while IFS= read -r line; do
  echo -e "[FRONTEND] $line"
done &
FRONTEND_PID=$!

# Wait for both processes to finish
wait