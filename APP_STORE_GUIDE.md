# App Store Submission Guide

## Overview
This guide will help you convert your React web app into an iOS app and submit it to the Apple App Store.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   
2. **Xcode** (Free, macOS only)
   - Download from Mac App Store
   - Required version: Latest (14.0+)

3. **macOS** (Required for iOS development)
   - You're on macOS, so you're good!

## Method 1: Using Capacitor (Recommended)

### Step 1: Install Capacitor

```bash
cd /Users/raghavdharani/Documents/Work/TTT
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
```

### Step 2: Initialize Capacitor

```bash
npx cap init "Tic Tac Toe with a Twist" com.yourcompany.tictactoe
```

### Step 3: Configure Capacitor

Edit `capacitor.config.ts` (or `.json`):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.tictactoe',
  appName: 'Tic Tac Toe with a Twist',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### Step 4: Add iOS Platform

```bash
npx cap add ios
```

### Step 5: Build Your App

```bash
npm run build
```

### Step 6: Sync to iOS

```bash
npx cap sync ios
```

### Step 7: Open in Xcode

```bash
npx cap open ios
```

### Step 8: Configure in Xcode

1. **Select your project** in the left sidebar
2. **General Tab:**
   - Set Display Name: "Tic Tac Toe with a Twist"
   - Set Bundle Identifier: `com.yourcompany.tictactoe` (must be unique)
   - Set Version: `1.0.0`
   - Set Build: `1`

3. **Signing & Capabilities:**
   - Select your Team (your Apple Developer account)
   - Xcode will automatically manage signing

4. **App Icons:**
   - Add app icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Required sizes: 1024x1024, 512x512, and various smaller sizes

### Step 9: Test in Simulator

1. Select a simulator (e.g., iPhone 14)
2. Click the Play button (▶️) or press `Cmd + R`
3. Test your app thoroughly

### Step 10: Prepare for Submission

1. **Archive your app:**
   - Product → Archive
   - Wait for archive to complete

2. **Validate:**
   - Click "Validate App"
   - Fix any issues that arise

3. **Distribute:**
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow the wizard

### Step 11: App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Create a new app:
   - Name: "Tic Tac Toe with a Twist"
   - Primary Language: English
   - Bundle ID: (select the one you created)
   - SKU: (unique identifier)

3. **App Information:**
   - Category: Games → Puzzle
   - Content Rights: Yes (if you own all content)
   - Age Rating: Complete questionnaire

4. **Pricing:**
   - Choose Free or Paid

5. **App Privacy:**
   - Complete privacy questionnaire
   - Add Privacy Policy URL (required)

6. **Version Information:**
   - Screenshots (required):
     - iPhone 6.7" Display: 1290 x 2796 pixels
     - iPhone 6.5" Display: 1242 x 2688 pixels
     - iPhone 5.5" Display: 1242 x 2208 pixels
   - Description
   - Keywords
   - Support URL
   - Marketing URL (optional)

7. **Submit for Review:**
   - Upload your build
   - Complete all required information
   - Submit

## Method 2: Using React Native (Alternative)

If you want a fully native experience, you'd need to rebuild using React Native:

```bash
npx react-native init TicTacToeApp
# Then migrate your components
```

This is more work but gives better performance.

## Required Assets

### App Icon
- Size: 1024x1024 pixels
- Format: PNG (no transparency)
- Design: Should represent your game

### Screenshots
Required sizes:
- iPhone 6.7" (iPhone 14 Pro Max): 1290 x 2796
- iPhone 6.5" (iPhone 11 Pro Max): 1242 x 2688
- iPhone 5.5" (iPhone 8 Plus): 1242 x 2208

You can take these in the iOS Simulator:
1. Run your app in simulator
2. Device → Screenshots → Save Screenshot
3. Or use `Cmd + S`

## App Store Listing

### Description Example:
```
Tic Tac Toe with a Twist - A strategic take on the classic game!

Features:
• Token limit system - Maximum 3 tokens per player
• Move tokens to adjacent squares
• Play single games or best-of series
• Choose who goes first
• Beautiful animated icons

Challenge yourself with this strategic twist on the classic Tic Tac Toe!
```

### Keywords:
`tic tac toe, strategy game, puzzle, board game, two player`

## Privacy Policy

You'll need a privacy policy URL. If your app doesn't collect data, a simple one is fine:

```
This app does not collect, store, or share any personal information.
All game data is stored locally on your device.
```

Host this on a simple website or GitHub Pages.

## Timeline

- Development: 1-2 days (if using Capacitor)
- App Store Review: 1-7 days (typically 24-48 hours)
- Total: ~1 week from start to App Store

## Costs

- Apple Developer Program: $99/year
- Hosting (for privacy policy): Free (GitHub Pages) or ~$5/month

## Tips

1. **Test thoroughly** on real devices before submitting
2. **Follow Apple's guidelines** - Review rejection is common
3. **Screenshots matter** - Make them look professional
4. **Description is important** - Use keywords naturally
5. **Be patient** - Review can take time

## Common Issues

1. **Signing errors**: Make sure your Apple Developer account is active
2. **Bundle ID conflicts**: Must be unique across all apps
3. **Missing assets**: All required screenshots and icons must be provided
4. **Privacy policy**: Required even if you don't collect data

## Next Steps

1. Set up Apple Developer account
2. Install Xcode
3. Follow Capacitor setup steps above
4. Test on simulator and real device
5. Prepare App Store assets
6. Submit for review

Good luck! 🚀

