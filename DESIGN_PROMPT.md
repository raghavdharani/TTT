# ShiftTacToe - Comprehensive UI Design Prompt

## Game Overview
ShiftTacToe is a strategic variant of Tic-Tac-Toe where players can move their tokens after placement. The game features:
- **Core Mechanics**: Players place up to 3 tokens each, then can move them to adjacent squares
- **Game Modes**: Single game, Best of 3, Best of 5
- **Play Modes**: 2-Player Offline, VS Computer (Easy/Hard/Insane), Online Multiplayer
- **Tokens**: Red X (pulses subtly) and Blue O (rotates slowly)
- **Platform**: Mobile-first implementation with future-proof web version in mind (React + Tailwind CSS)

## Design Philosophy

### Core Aesthetic
Create a **simplistic yet mystical** design that feels:
- **Modern & Clean**: Minimalist interface with purposeful whitespace
- **Mystical & Enchanting**: Subtle magical elements, soft glows, ethereal transitions
- **Elegant & Refined**: Smooth animations, polished interactions, premium feel
- **Consistent**: Unified design language across all screens and components

### Visual Style Keywords
- Ethereal, Minimalist, Mystical, Elegant, Smooth, Polished, Modern, Clean, Purposeful, Enchanting

## Design Requirements

### 1. Color Palette

**Primary Colors:**
- **Background**: Deep navy with subtle purple undertones (primary). Alternatively, warm off-white with blue tint for mystical quality, but deep navy is primary for current designs.
- **Surface/Cards**: Elevated glassmorphism with subtle transparency and soft shadows
- **Text Primary**: High contrast for readability (pure white for dark backgrounds, near-black for light backgrounds)
- **Text Secondary**: Muted tones for less important information (14px, reduced opacity)

**Token Colors (Fixed):**
- **X Token**: Red (#dc2626) - solid filled, pulses subtly
- **O Token**: Blue (#2563eb) - solid filled, rotates slowly

**Accent Colors:**
- **Primary Action**: Soft blue or purple with mystical glow
- **Success/Positive**: Gentle green with ethereal quality
- **Warning/Attention**: Warm amber with soft glow
- **Error/Negative**: Soft red (not harsh)

**Interactive States:**
- **Hover**: Subtle glow, slight scale, smooth transition
- **Active/Selected**: Enhanced glow, gentle pulse, mystical aura
- **Disabled**: Reduced opacity, muted colors, no interaction

### 2. Typography

**Font Selection:**
- **Primary Font**: Modern sans-serif with mystical character (consider: Inter, Poppins, or custom font with subtle elegance)
- **Headings**: Slightly bolder, more pronounced (can use same family with weight variations)
- **Body Text**: Clean, readable, comfortable line height
- **Game Status**: Clear, prominent, easy to scan

**Typography Scale:**
- **Hero/Title**: 3xl-4xl (48-64px) - Bold, mystical presence
- **Section Headers**: 2xl (32px) - Clear hierarchy
- **Body Text**: base (16px) - Comfortable reading
- **Small Text**: sm (14px) - Secondary information
- **Tiny Text**: xs (12px) - Labels, hints

### 3. Layout & Spacing

**Container Structure:**
- **Max Width**: Comfortable reading width (max-w-4xl or max-w-5xl for main content)
- **Padding**: Generous whitespace (p-6 to p-8 on mobile, p-8 to p-12 on desktop)
- **Grid System**: Consistent spacing using Tailwind's spacing scale
- **Card/Component Spacing**: Clear separation between elements (gap-4 to gap-6)

**Responsive Breakpoints:**
- **Mobile**: < 640px - Single column, stacked layout, touch-friendly
- **Tablet**: 640px - 1024px - Optimized for medium screens
- **Desktop**: > 1024px - Full layout with optimal spacing

### 4. Components to Design (Mobile-First)

#### 1. ShiftTacToe Welcome/Home Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A centered home/setup screen for 'ShiftTacToe'. The title 'ShiftTacToe' is prominently displayed with mystical styling (48-64px), centered on a deep navy background with subtle purple undertones. It features a prominent 'Start New Game' button and a 'Settings' button, both as glassmorphism cards with soft blue/purple mystical glows, adhering to the 44x44px touch-friendly minimum. Buttons should have hover/active states with subtle scaling (1.02-1.05) and glow increase. All transitions between selections are smooth (200-400ms, ease-in-out). Text is high contrast (pure white, Inter/Poppins style, 16px body).

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 2. ShiftTacToe Game Setup Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A game setup screen for 'ShiftTacToe'. Users choose between single-player ('VS Computer') and multiplayer ('2 Player') modes using glassmorphism card buttons. The design maintains the deep navy background with subtle purple undertones. Progressive disclosure is used for 'Difficulty' (Easy/Hard/Insane), 'Game Mode' (Single/Best of 3/Best of 5) when 'VS Computer' is chosen, or 'Starting Player' (X/O tokens with animations: Red X pulsing, Blue O slowly rotating) when '2 Player' is chosen. Selected states have an enhanced glow and gentle pulse. A 'Start Game' button with a mystical glow (soft blue/purple) at the bottom. Typography is clean (Inter/Poppins style, 16px body, 14px secondary) and high contrast. Smooth transitions (200-400ms) for all interactive elements.

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 3. ShiftTacToe Game Board Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A 3x3 game board for 'ShiftTacToe'. The main 3x3 grid is clean and modern with rounded corners, subtle borders, and layered soft shadows, giving it a sacred game space feel. Squares are elevated glassmorphism surfaces. Hover/tap effects on squares involve a subtle scale (1.05) and glow increase. Token X (solid red #dc2626) is placed with a scale 0->1 bounce and fade-in with glow (300-400ms) and has a continuous subtle pulse. Token O (solid blue #2563eb) is placed with similar animation and has a slow rotation (3s per rotation). Token movement is a smooth slide with a slight arc and glow trail (400-500ms). Visual states for squares: Enabled (subtle pulse/glow), Disabled (muted), Relocating (highlighted), Valid destinations (subtle highlight). Background is deep navy with subtle purple undertones.

**Mobile Navigation:** ["Game", "History", "Settings"] (Note: Navigation items adapted to context of playing game)

#### 4. ShiftTacToe Game End Results Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A game end/results screen for 'ShiftTacToe'. It elegantly displays the game's outcome (Win, Lose, Draw) using prominent (48-64px) high-contrast text against the deep navy background with subtle purple undertones. Win celebrations include an enhanced glow, pulse, and subtle particle effects. Options to 'Play Again' and 'Return to Home Screen' are presented as glassmorphism card buttons with soft blue/purple mystical glows, adhering to touch-friendly sizes. All transitions are smooth (200-400ms, ease-in-out). Typography is clean (Inter/Poppins style, 16px body) and high contrast.

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 5. ShiftTacToe Online Setup Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** An Online Setup screen for 'ShiftTacToe'. It should feature a clean, modern interface with a deep navy background and subtle purple undertones. Prominent glassmorphism cards for 'Create Room' and 'Join Room' actions, both with soft blue/purple mystical glows and touch-friendly dimensions. Below these, a connection status indicator with mystical visual cues (e.g., subtle pulsing icons or shimmering text). When a room is created, a copyable Room ID is displayed in an elegant, styled manner, perhaps within a glassmorphism field. Waiting animations for connecting or waiting for a player should be subtle (e.g., gentle pulse or shimmer effect on relevant elements). Text is high contrast (pure white, Inter/Poppins style, 16px body, 14px secondary) with clear hierarchy. Smooth transitions (200-400ms) for all interactive elements and status changes.

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 6. ShiftTacToe Settings Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A Settings screen for 'ShiftTacToe'. It should feature a clean, minimalist layout with a deep navy background and subtle purple undertones. Glassmorphism cards for various settings categories like 'Sound', 'Notifications', 'Account', 'Privacy', and 'About'. Each setting option within a card should be clearly presented with high-contrast text (pure white, Inter/Poppins style, 16px body, 14px secondary) and interactive elements (e.g., toggles, buttons) styled with soft blue/purple mystical glows, touch-friendly. Smooth transitions (200-400ms) for navigating settings and saving changes. Animated subtle mystical accents (e.g., small glowing particles) can be present but not overwhelming.

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 7. ShiftTacToe Profile Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A Profile screen for 'ShiftTacToe'. It should display user information (e.g., Username, Avatar/Icon, Total Wins, Losses, Draws). The layout should be clean, modern, and centered, using glassmorphism cards for different sections on a deep navy background with subtle purple undertones. The user's avatar could be a subtly animated mystical icon. High-contrast text (pure white, Inter/Poppins style, 16px body) and clear hierarchy. Editable fields should have clear input states and smooth transitions on focus/edit (200-400ms). A 'Logout' button styled as a glassmorphism card with a soft red accent glow for attention.

**Mobile Navigation:** ["Home", "Play", "Settings", "Profile"]

#### 8. ShiftTacToe About/Help Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** An About/Help screen for 'ShiftTacToe'. This screen provides information about the game, its rules, credits, and potentially a FAQ or contact support. It should have a clean, scrollable layout with sections organized within glassmorphism cards on a deep navy background with subtle purple undertones. High-contrast, readable text (pure white, Inter/Poppins style, 16px body, 14px secondary) with clear headings (48-64px). Links or expandable sections for rules/FAQ should have soft blue/purple mystical glows on interaction and smooth transitions (200-400ms). The overall feel should be informative yet retain the app's mystical and elegant aesthetic.

**Mobile Navigation:** ["Home", "Play", "Settings"]

#### 9. ShiftTacToe Leaderboard/History Screen
**Context:** Mobile 'ShiftTacToe' app with a strategic Tic-Tac-Toe variant. Modern, simplistic yet mystical, ethereal aesthetic, minimalist with purposeful details, premium polished feel, enchanting but not overwhelming.

**Description:** A Leaderboard/History screen for 'ShiftTacToe'. This screen displays player rankings (leaderboard) and/or a history of past games. It should feature a clean, organized layout with a deep navy background and subtle purple undertones. Glassmorphism cards can be used for individual player entries or game history items, showing relevant stats (e.g., rank, username, wins, game date, outcome). High-contrast text (pure white, Inter/Poppins style, 16px body, 14px secondary) and clear hierarchy. Interactive elements for filtering or sorting (if applicable) should use soft blue/purple mystical glows and smooth transitions (200-400ms). The screen should feel premium and elegant, reflecting achievements within the mystical game world. An animated mystical element could subtly indicate the user's position on the leaderboard.

**Mobile Navigation:** ["Home", "Play", "Settings", "History"]

### 5. Animations & Transitions

**General Principles:**
- **Duration**: 200-400ms for most transitions (smooth, not sluggish)
- **Easing**: Use elegant easing curves (ease-in-out, custom cubic-bezier)
- **Purpose**: Every animation should have purpose (feedback, delight, guidance)

**Specific Animations:**

**Token Animations (Already Implemented):**
- X Token: Subtle pulse animation (continuous, gentle)
- O Token: Slow rotation (3 seconds per rotation, smooth)

**Token Placement:**
- Scale from 0 to 1 with slight bounce (mystical appearance)
- Fade in with glow effect
- Subtle background light briefly illuminates square
- Token actively pulses/rotates upon landing
- Duration: 300-400ms

**Token Movement:**
- Smooth slide animation from source to destination
- Slight arc or curve for elegance
- Glow trail effect (mystical)
- Token's inherent animation (pulse/rotation) continues during movement
- 'Relocating' and 'valid destination' squares have subtle highlights
- Duration: 400-500ms

**Square Interactions:**
- Hover: Scale (1.05), glow increase, smooth transition (200ms)
- Click: Brief scale down (0.95) then back (100ms)
- Enabled state: Subtle pulse or glow
- Disabled state: Fade to muted state

**Screen Transitions:**
- Fade between screens (300-400ms)
- Optional: Slide or scale transitions (keep subtle)
- Maintain mystical feel

**Button Interactions:**
- Hover: Scale (1.02-1.05), glow increase, color shift
- Active: Scale down (0.98), brief feedback
- Smooth transitions (200ms)

**Status Updates:**
- Fade in/out for status messages (300ms)
- Smooth score updates (count-up animation optional)
- Win celebration: 
  - Winning line tokens experience enhanced, vibrant glow and accelerated pulse
  - Shower of subtle, ethereal particles matching token color emanating from tokens, floating upwards and dissipating
  - Rest of board subtly dims
  - Game Status display smoothly transitions to winner announcement with prominent, glowing text

**Loading States:**
- Subtle shimmer or pulse
- Smooth spinner (if needed)
- Mystical glow effect

### 6. Visual Effects & Details

**Glassmorphism:**
- **Application**: Central to all surface elements (buttons, cards, input fields)
- **Appearance**: Frosted glass effect with subtle transparency and backdrop blur, creating an elevated and ethereal feel
- **Maintains readability** with high-contrast text

**Shadows:**
- **Application**: For depth, separation, and mystical ambiance
- **Appearance**: Soft and layered for depth, making glassmorphism elements appear to float. Mystical glow shadows emanate from active/selected elements

**Gradients:**
- **Application**: Primarily for background to establish mood, potentially subtle within UI elements
- **Appearance**: Deep navy with subtle purple undertones for the main background, possibly with a very gentle, almost imperceptible gradient shift

**Glows:**
- **Application**: Signature mystical element for interaction states, selections, primary actions, and tokens
- **Appearance**: Soft, colored glows (soft blue/purple for actions, red for X, blue for O), with interactive intensity increases, pulses, and ethereal aura effects

**Borders & Outlines:**
- Rounded corners throughout (modern feel)
- Subtle borders or no borders (clean)
- Glow outlines for selected/active states

### 7. Responsive Design Considerations

**Mobile-First (Primary):**
- Touch-friendly targets (min 44x44px)
- Adequate spacing for fingers
- Readable text sizes (16px body, 14px secondary)
- Stacked layouts on small screens
- Optimized board size for mobile screens
- Native app ready: Design translates well to native mobile UI patterns

**Tablet:**
- Balanced layouts, optimal spacing
- Potential for two-column/side-by-side elements
- Comfortable touch targets
- Optimal use of screen space

**Desktop (Future):**
- Generous spacing, full hover states for mouse
- Robust keyboard navigation
- Scalable to large resolutions
- More generous spacing
- Larger board if desired

### 8. Accessibility Requirements

**Visual:**
- High contrast ratios (WCAG AA minimum)
- Clear focus indicators
- Readable font sizes
- Color not the only indicator (use icons, shapes, patterns)

**Interaction:**
- Keyboard navigation support
- Screen reader friendly
- Clear labels and ARIA attributes
- Touch targets meet size requirements

**Animation:**
- Respect prefers-reduced-motion
- Provide option to disable animations if needed
- Animations should not cause motion sickness

### 9. Specific Design Challenges

**Token Relocation State:**
- Clear visual indication of which token is being moved
- Highlight valid destination squares
- Show original position (subtle marker)
- Smooth transition when switching tokens

**Game Over States:**
- Win: Celebratory but elegant (enhanced glow, subtle animation)
- Draw: Neutral, clear indication
- Series completion: Special treatment, mystical celebration

**Online Mode Indicators:**
- Connection status (clear, non-intrusive)
- Turn indicators (whose turn it is)
- Waiting states (elegant, not frustrating)
- Error states (helpful, recoverable)

**Computer Thinking:**
- Clear indicator that computer is thinking
- Mystical animation (pulse, glow, spinner)
- Prevent user interaction during thinking

### 10. Design Deliverables Expected

**For Each Screen/Component:**
1. **Visual Mockups**: High-fidelity designs for mobile, tablet, desktop
2. **Component Specifications**: 
   - Colors (hex codes)
   - Typography (font, size, weight, line height)
   - Spacing (padding, margins, gaps)
   - Border radius
   - Shadows
   - Animations (duration, easing, keyframes)
3. **Interaction States**: Hover, active, disabled, selected, focused
4. **Animation Guidelines**: Detailed specs for all transitions
5. **Responsive Breakpoints**: How components adapt across screen sizes
6. **Design System**: 
   - Color palette with usage guidelines
   - Typography scale
   - Spacing system
   - Component library
   - Animation library

**Additional Deliverables:**
- Style guide document
- Animation timing chart
- Accessibility checklist
- Mobile app design considerations document

### 11. Technical Constraints

**Current Stack:**
- React 18.2.0
- Tailwind CSS 3.4.0
- Vite build system
- SVG for tokens (already implemented)

**Implementation Notes:**
- Use Tailwind utility classes where possible
- Custom CSS for complex animations (if needed)
- SVG animations for tokens (already working)
- CSS transitions for most interactions
- Consider CSS custom properties for theming

**Performance:**
- Smooth 60fps animations
- Optimized for web performance
- Consider GPU acceleration for transforms
- Lazy load heavy animations if needed

### 12. Design Inspiration Keywords

- Minimalist game interfaces
- Mystical/ethereal UI design
- Modern board game aesthetics
- Elegant web applications
- Premium mobile game interfaces
- Glassmorphism design
- Soft shadows and glows
- Smooth micro-interactions

### 13. Success Criteria

The design should:
- ✅ Feel cohesive and consistent across all screens
- ✅ Be modern and visually appealing
- ✅ Have smooth, elegant transitions throughout
- ✅ Maintain simplistic yet mystical aesthetic
- ✅ Work beautifully on web (current priority)
- ✅ Be easily adaptable to mobile app (future)
- ✅ Be accessible and inclusive
- ✅ Enhance gameplay experience without distracting
- ✅ Feel premium and polished
- ✅ Guide users intuitively through the game

---

## Final Notes

This design should elevate ShiftTacToe from a functional game to a **beautiful, enchanting experience**. Every pixel should feel intentional, every animation should feel magical, and every interaction should feel smooth and delightful. The design should make players want to play again, not just for the gameplay, but for the joy of interacting with a beautifully crafted interface.

Think of it as creating a **digital artifact** - something that feels special, mystical, and timeless, while remaining modern and functional.

