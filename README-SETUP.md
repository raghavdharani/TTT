# Quick Setup Guide

## If Node.js is NOT installed:

### Option 1: Install via nvm (Recommended)
Open Terminal and run:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
```

### Option 2: Install via Homebrew
```bash
brew install node
```

### Option 3: Download from nodejs.org
1. Visit https://nodejs.org/
2. Download LTS version for macOS
3. Run installer
4. Restart terminal

## Once Node.js is installed:

```bash
cd /Users/raghavdharani/Documents/Work/TTT
npm install
npm test
```

## Or use the setup script:

```bash
cd /Users/raghavdharani/Documents/Work/TTT
bash setup-and-test.sh
```

