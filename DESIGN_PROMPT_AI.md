# ShiftTacToe - AI Design Generator Prompt (Mobile-First)

## Direct Prompt for AI Design Tools

```
Design a comprehensive, modern mobile-first UI for "ShiftTacToe" - a strategic Tic-Tac-Toe variant game. 

STYLE: Simplistic yet mystical, modern elegance, smooth transitions, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming, timeless yet modern, joyful interactions, beautiful craftsmanship.

COLOR PALETTE:
- Background: Deep navy with subtle purple undertones (primary). Alternatively, warm off-white with blue tint for mystical quality, but deep navy is primary for current designs.
- Surface/Cards: Elevated glassmorphism with subtle transparency and soft shadows
- Primary Actions: Soft blue/purple with mystical glow
- X Token: Solid red (#dc2626) with continuous subtle pulse animation
- O Token: Solid blue (#2563eb) with slow rotation animation (3s per rotation)
- Accents: Gentle greens (success), warm amber (attention), soft reds (errors)
- Text: High contrast for readability (pure white for dark backgrounds)

TYPOGRAPHY: Modern sans-serif (Inter/Poppins style), clean and readable, mystical character, clear hierarchy:
- Titles: 48-64px (e.g., "ShiftTacToe" app title, "X Wins!")
- Body Text: 16px (e.g., button labels, main content, list items)
- Secondary Text: 14px (e.g., minor details, hints, sub-labels)
- Contrast: WCAG AA compliant high contrast

VISUAL EFFECTS:
- Glassmorphism: Central to all surface elements (buttons, cards, input fields). Frosted glass effect with subtle transparency and backdrop blur, creating an elevated and ethereal feel.
- Shadows: Soft and layered for depth, making glassmorphism elements appear to float. Mystical glow shadows emanate from active/selected elements.
- Gradients: Deep navy with subtle purple undertones for the main background, possibly with a very gentle, almost imperceptible gradient shift.
- Glows: Signature mystical element for interaction states, selections, primary actions, and tokens. Soft, colored glows (soft blue/purple for actions, red for X, blue for O), with interactive intensity increases, pulses, and ethereal aura effects.

ANIMATIONS & INTERACTIONS:
- Duration: Generally 200-400ms for smooth, not sluggish interactions (token movement up to 500ms)
- Easing: Elegant curves (ease-in-out, custom cubic-bezier)
- Token X: Continuous subtle pulse
- Token O: Slow rotation (3s per rotation)
- Screen Transitions: Fade (300-400ms), optional subtle slide/scale
- Buttons & Actions: Hover/Tap: Scale 1.02-1.05, glow increase, subtle color shift (200ms, ease-in-out). Active/Press: Brief scale 0.98 for tactile feedback. Primary Actions: Inherent mystical glow, brief intensification/pulse on tap.
- Token Placement: Scale 0→1 with slight bounce, fade-in with glow (300-400ms). Subtle background light briefly illuminates square, token actively pulses/rotates upon landing.
- Token Movement: Smooth slide with slight arc, leaving a glow trail (400-500ms). Token's inherent animation (pulse/rotation) continues. 'Relocating' and 'valid destination' squares have subtle highlights.
- Win Celebration: Winning line tokens experience enhanced, vibrant glow and accelerated pulse. Shower of subtle, ethereal particles matching token color emanating from tokens, floating upwards and dissipating. Rest of board subtly dims. Game Status display smoothly transitions to winner announcement with prominent, glowing text.

SCREENS TO DESIGN (Mobile-First):

1. WELCOME/HOME SCREEN:
   Centered home/setup screen for 'ShiftTacToe'. The title 'ShiftTacToe' is prominently displayed with mystical styling (48-64px), centered on a deep navy background with subtle purple undertones. Features a prominent 'Start New Game' button and a 'Settings' button, both as glassmorphism cards with soft blue/purple mystical glows, adhering to the 44x44px touch-friendly minimum. Buttons have hover/active states with subtle scaling (1.02-1.05) and glow increase. All transitions are smooth (200-400ms, ease-in-out). Text is high contrast (pure white, Inter/Poppins style, 16px body). Mobile Navigation: ["Home", "Play", "Settings"]

2. GAME SETUP SCREEN:
   Game setup screen for 'ShiftTacToe'. Users choose between single-player ('VS Computer') and multiplayer ('2 Player') modes using glassmorphism card buttons. Design maintains the deep navy background with subtle purple undertones. Progressive disclosure for 'Difficulty' (Easy/Hard/Insane), 'Game Mode' (Single/Best of 3/Best of 5) when 'VS Computer' is chosen, or 'Starting Player' (X/O tokens with animations: Red X pulsing, Blue O slowly rotating) when '2 Player' is chosen. Selected states have enhanced glow and gentle pulse. A 'Start Game' button with mystical glow (soft blue/purple) at the bottom. Typography is clean (Inter/Poppins style, 16px body, 14px secondary) and high contrast. Smooth transitions (200-400ms) for all interactive elements. Mobile Navigation: ["Home", "Play", "Settings"]

3. GAME BOARD SCREEN:
   3x3 game board for 'ShiftTacToe'. The main 3x3 grid is clean and modern with rounded corners, subtle borders, and layered soft shadows, giving it a sacred game space feel. Squares are elevated glassmorphism surfaces. Hover/tap effects on squares involve a subtle scale (1.05) and glow increase. Token X (solid red #dc2626) is placed with a scale 0->1 bounce and fade-in with glow (300-400ms) and has a continuous subtle pulse. Token O (solid blue #2563eb) is placed with similar animation and has a slow rotation (3s per rotation). Token movement is a smooth slide with a slight arc and glow trail (400-500ms). Visual states for squares: Enabled (subtle pulse/glow), Disabled (muted), Relocating (highlighted), Valid destinations (subtle highlight). Background is deep navy with subtle purple undertones. Mobile Navigation: ["Game", "History", "Settings"]

4. GAME END RESULTS SCREEN:
   Game end/results screen for 'ShiftTacToe'. Elegantly displays the game's outcome (Win, Lose, Draw) using prominent (48-64px) high-contrast text against the deep navy background with subtle purple undertones. Win celebrations include enhanced glow, pulse, and subtle particle effects. Options to 'Play Again' and 'Return to Home Screen' are presented as glassmorphism card buttons with soft blue/purple mystical glows, adhering to touch-friendly sizes. All transitions are smooth (200-400ms, ease-in-out). Typography is clean (Inter/Poppins style, 16px body) and high contrast. Mobile Navigation: ["Home", "Play", "Settings"]

5. ONLINE SETUP SCREEN:
   Online Setup screen for 'ShiftTacToe'. Clean, modern interface with a deep navy background and subtle purple undertones. Prominent glassmorphism cards for 'Create Room' and 'Join Room' actions, both with soft blue/purple mystical glows and touch-friendly dimensions. Below these, a connection status indicator with mystical visual cues (e.g., subtle pulsing icons or shimmering text). When a room is created, a copyable Room ID is displayed in an elegant, styled manner, perhaps within a glassmorphism field. Waiting animations for connecting or waiting for a player should be subtle (e.g., gentle pulse or shimmer effect on relevant elements). Text is high contrast (pure white, Inter/Poppins style, 16px body, 14px secondary) with clear hierarchy. Smooth transitions (200-400ms) for all interactive elements and status changes. Mobile Navigation: ["Home", "Play", "Settings"]

6. SETTINGS SCREEN:
   Settings screen for 'ShiftTacToe'. Clean, minimalist layout with a deep navy background and subtle purple undertones. Glassmorphism cards for various settings categories like 'Sound', 'Notifications', 'Account', 'Privacy', and 'About'. Each setting option within a card should be clearly presented with high-contrast text (pure white, Inter/Poppins style, 16px body, 14px secondary) and interactive elements (e.g., toggles, buttons) styled with soft blue/purple mystical glows, touch-friendly. Smooth transitions (200-400ms) for navigating settings and saving changes. Animated subtle mystical accents (e.g., small glowing particles) can be present but not overwhelming. Mobile Navigation: ["Home", "Play", "Settings"]

7. PROFILE SCREEN:
   Profile screen for 'ShiftTacToe'. Displays user information (e.g., Username, Avatar/Icon, Total Wins, Losses, Draws). Clean, modern, and centered layout, using glassmorphism cards for different sections on a deep navy background with subtle purple undertones. The user's avatar could be a subtly animated mystical icon. High-contrast text (pure white, Inter/Poppins style, 16px body) and clear hierarchy. Editable fields should have clear input states and smooth transitions on focus/edit (200-400ms). A 'Logout' button styled as a glassmorphism card with a soft red accent glow for attention. Mobile Navigation: ["Home", "Play", "Settings", "Profile"]

8. ABOUT/HELP SCREEN:
   About/Help screen for 'ShiftTacToe'. Provides information about the game, its rules, credits, and potentially a FAQ or contact support. Clean, scrollable layout with sections organized within glassmorphism cards on a deep navy background with subtle purple undertones. High-contrast, readable text (pure white, Inter/Poppins style, 16px body, 14px secondary) with clear headings (48-64px). Links or expandable sections for rules/FAQ should have soft blue/purple mystical glows on interaction and smooth transitions (200-400ms). The overall feel should be informative yet retain the app's mystical and elegant aesthetic. Mobile Navigation: ["Home", "Play", "Settings"]

9. LEADERBOARD/HISTORY SCREEN:
   Leaderboard/History screen for 'ShiftTacToe'. Displays player rankings (leaderboard) and/or a history of past games. Clean, organized layout with a deep navy background and subtle purple undertones. Glassmorphism cards can be used for individual player entries or game history items, showing relevant stats (e.g., rank, username, wins, game date, outcome). High-contrast text (pure white, Inter/Poppins style, 16px body, 14px secondary) and clear hierarchy. Interactive elements for filtering or sorting (if applicable) should use soft blue/purple mystical glows and smooth transitions (200-400ms). The screen should feel premium and elegant, reflecting achievements within the mystical game world. An animated mystical element could subtly indicate the user's position on the leaderboard. Mobile Navigation: ["Home", "Play", "Settings", "History"]

RESPONSIVE DESIGN:
- Mobile-First: Touch-friendly (44x44px min), stacked layouts, readable text sizes (16px body, 14px secondary)
- Tablet: Balanced layouts, optimal spacing, potential for two-column/side-by-side elements
- Desktop (Future): Generous spacing, full hover states for mouse, robust keyboard navigation, scalable to large resolutions
- Native App Ready: Design translates well to native mobile UI patterns

ACCESSIBILITY:
- High contrast (WCAG AA)
- Clear focus indicators
- Keyboard navigation (for future web/desktop)
- Respects prefers-reduced-motion
- Color not solely an indicator for conveying information

DELIVERABLES NEEDED:
- Visual mockups (mobile, tablet, desktop)
- Component specifications (colors, typography, spacing, animations)
- Interaction states (hover, active, disabled, selected)
- Animation guidelines (duration, easing, keyframes)
- Design system (color palette, typography scale, spacing, components)
- Style guide document

MOOD: Enchanting digital artifact, mystical game experience, premium feel, timeless yet modern, joyful interactions, beautiful craftsmanship.
```

## Alternative Short Prompt

```
Create a modern, mystical mobile-first UI design for ShiftTacToe game with:
- Simplistic yet ethereal aesthetic
- Deep navy with purple undertones background with glassmorphism
- Smooth 200-400ms transitions with elegant easing
- Red X tokens (pulse) and Blue O tokens (slow rotate)
- Soft glows, rounded corners, layered shadows
- 9 screens: Welcome, Setup, Game Board, Results, Online Setup, Settings, Profile, Help, Leaderboard
- Mobile-first responsive design, touch-friendly (44x44px min)
- Premium polished feel, enchanting but functional
- Deliver: Mockups, specs, animations, design system
```

## Screen-Specific Prompts

### 1. Welcome/Home Screen
```
Design a mobile home screen for ShiftTacToe: Centered mystical title "ShiftTacToe" (48-64px) on deep navy background with purple undertones. Prominent 'Start New Game' and 'Settings' buttons as glassmorphism cards with soft blue/purple mystical glows, touch-friendly (44x44px min). Smooth transitions (200-400ms). High-contrast white text (Inter/Poppins, 16px body). Mobile navigation: ["Home", "Play", "Settings"]
```

### 2. Game Setup Screen
```
Design a mobile game setup screen for ShiftTacToe: Deep navy background. Glassmorphism card buttons for 'VS Computer' and '2 Player' modes. Progressive disclosure for Difficulty (Easy/Hard/Insane), Game Mode (Single/Best of 3/Best of 5), Starting Player (animated X/O tokens). Selected states with enhanced glow and pulse. 'Start Game' button with mystical glow at bottom. Smooth transitions (200-400ms). High-contrast typography (Inter/Poppins, 16px body, 14px secondary). Mobile navigation: ["Home", "Play", "Settings"]
```

### 3. Game Board Screen
```
Design a mobile 3x3 game board for ShiftTacToe: Clean grid with rounded corners, subtle borders, layered shadows, sacred game space feel. Squares are elevated glassmorphism surfaces. Hover/tap effects: scale 1.05, glow increase. Token X (red #dc2626) places with scale 0->1 bounce, fade-in with glow (300-400ms), continuous pulse. Token O (blue #2563eb) places similarly, slow rotation (3s). Token movement: smooth slide with arc, glow trail (400-500ms). Visual states: Enabled (pulse/glow), Disabled (muted), Relocating (highlighted), Valid destinations (subtle highlight). Deep navy background. Mobile navigation: ["Game", "History", "Settings"]
```

### 4. Game End Results Screen
```
Design a mobile game end/results screen for ShiftTacToe: Elegantly displays outcome (Win, Lose, Draw) with prominent text (48-64px) on deep navy background. Win celebrations: enhanced glow, pulse, subtle particle effects. 'Play Again' and 'Return to Home' buttons as glassmorphism cards with mystical glows, touch-friendly. Smooth transitions (200-400ms). High-contrast typography (Inter/Poppins, 16px body). Mobile navigation: ["Home", "Play", "Settings"]
```

### 5. Online Setup Screen
```
Design a mobile online setup screen for ShiftTacToe: Clean interface on deep navy background. Glassmorphism cards for 'Create Room' and 'Join Room' with mystical glows, touch-friendly. Connection status indicator with mystical visual cues (pulsing icons, shimmering text). Copyable Room ID in elegant glassmorphism field. Waiting animations: gentle pulse or shimmer. High-contrast text (Inter/Poppins, 16px body, 14px secondary). Smooth transitions (200-400ms). Mobile navigation: ["Home", "Play", "Settings"]
```

### 6. Settings Screen
```
Design a mobile settings screen for ShiftTacToe: Clean, minimalist layout on deep navy background. Glassmorphism cards for settings categories (Sound, Notifications, Account, Privacy, About). High-contrast text (Inter/Poppins, 16px body, 14px secondary). Interactive elements (toggles, buttons) with soft blue/purple mystical glows, touch-friendly. Smooth transitions (200-400ms). Subtle animated mystical accents (small glowing particles). Mobile navigation: ["Home", "Play", "Settings"]
```

### 7. Profile Screen
```
Design a mobile profile screen for ShiftTacToe: Displays user info (Username, Avatar, Wins, Losses, Draws). Clean, centered layout with glassmorphism cards on deep navy background. Subtly animated mystical avatar icon. High-contrast text (Inter/Poppins, 16px body). Editable fields with clear input states, smooth transitions (200-400ms). 'Logout' button as glassmorphism card with soft red accent glow. Mobile navigation: ["Home", "Play", "Settings", "Profile"]
```

### 8. About/Help Screen
```
Design a mobile about/help screen for ShiftTacToe: Scrollable layout with sections in glassmorphism cards on deep navy background. Information about game, rules, credits, FAQ, contact support. High-contrast text (Inter/Poppins, 16px body, 14px secondary) with clear headings (48-64px). Links/expandable sections with mystical glows on interaction, smooth transitions (200-400ms). Informative yet retains mystical, elegant aesthetic. Mobile navigation: ["Home", "Play", "Settings"]
```

### 9. Leaderboard/History Screen
```
Design a mobile leaderboard/history screen for ShiftTacToe: Clean, organized layout on deep navy background. Glassmorphism cards for player entries or game history items showing stats (rank, username, wins, date, outcome). High-contrast text (Inter/Poppins, 16px body, 14px secondary). Interactive filtering/sorting elements with mystical glows, smooth transitions (200-400ms). Premium, elegant feel. Animated mystical element subtly indicates user's position. Mobile navigation: ["Home", "Play", "Settings", "History"]
```

## Style Reference Keywords
```
Minimalist game UI, mystical interface design, ethereal mobile app design, modern board game aesthetics, glassmorphism, soft shadows, elegant micro-interactions, premium mobile game UI, smooth animations, enchanting user experience, mobile-first design, touch-friendly interface, native app patterns
```
