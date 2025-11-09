#!/bin/bash

# Setup script for Tic Tac Toe project
# This script will install Node.js and run tests

set -e  # Exit on error

echo "🚀 Setting up Node.js and running tests..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if node is already available
if command -v node &> /dev/null; then
    echo "✅ Node.js is already installed: $(node --version)"
    echo "✅ npm version: $(npm --version)"
else
    echo "📦 Installing Node.js LTS..."
    nvm install --lts
    nvm use --lts
    nvm alias default --lts
    echo "✅ Node.js installed: $(node --version)"
    echo "✅ npm version: $(npm --version)"
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies
echo ""
echo "📥 Installing project dependencies..."
npm install

# Run tests
echo ""
echo "🧪 Running tests..."
npm test

echo ""
echo "✅ All done!"

