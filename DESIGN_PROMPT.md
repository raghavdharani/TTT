# ShiftTacToe - Comprehensive UI Design Prompt

## Game Overview
ShiftTacToe is a strategic variant of Tic-Tac-Toe where players can move their tokens after placement. The game features:
- **Core Mechanics**: Players place up to 3 tokens each, then can move them to adjacent squares
- **Game Modes**: Single game, Best of 3, Best of 5
- **Play Modes**: 2-Player Offline, VS Computer (Easy/Hard/Insane), Online Multiplayer
- **Tokens**: Red X (pulses subtly) and Blue O (rotates slowly)
- **Platform**: Web-first (React + Tailwind CSS), mobile-ready for future migration

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
- **Background**: Soft gradient or solid color with mystical quality (consider: deep navy with subtle purple undertones, or warm off-white with slight blue tint)
- **Surface/Cards**: Elevated surfaces with subtle shadows and slight transparency/glassmorphism
- **Text Primary**: High contrast for readability (near-black or pure white depending on background)
- **Text Secondary**: Muted tones for less important information

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

### 4. Components to Design

#### A. Home/Setup Screen (GameSetup.jsx)
**Elements:**
- Game title "ShiftTacToe" with mystical styling
- Subtitle/tagline
- Play mode selection (3 buttons: 2 Player, VS Computer, Online)
- Difficulty selection (for VS Computer: Easy, Hard, Insane)
- Game mode selection (Single Game, Best of 3, Best of 5)
- Starting player selection (X or O tokens)
- Start game button
- Help/Instructions button

**Design Requirements:**
- Clean, centered layout
- Progressive disclosure (show options as user selects)
- Smooth transitions between selection states
- Token previews with animations
- Mystical glow on selected options
- Clear visual hierarchy

#### B. Game Board (Board.jsx + Square.jsx)
**Elements:**
- 3x3 grid of squares
- Tokens (animated X and O)
- Visual feedback for:
  - Enabled squares (hoverable, clickable)
  - Disabled squares (grayed out)
  - Token being relocated (highlighted, glowing)
  - Valid move destinations (subtle highlight/glow)
  - Invalid moves (visual feedback)

**Design Requirements:**
- Clean grid with subtle borders or shadows
- Squares with rounded corners (modern feel)
- Smooth hover effects (scale, glow, color shift)
- Clear visual distinction between states
- Mystical glow on interactive elements
- Smooth token placement/movement animations
- Board should feel like a sacred game space

#### C. Game Status Display (GameStatus.jsx)
**Elements:**
- Current player indicator
- Game status message (turn, win, draw, relocating)
- Series score (for Best of 3/5)
- Token counts
- Computer thinking indicator

**Design Requirements:**
- Prominent but not overwhelming
- Clear hierarchy of information
- Animated token indicators
- Smooth transitions when status changes
- Mystical styling for important messages (wins, series completion)
- Elegant score display

#### D. Online Game Setup (OnlineGameSetup.jsx)
**Elements:**
- Create room button
- Join room input and button
- Room ID display
- Connection status indicator
- Waiting for player message
- Player ready indicators
- Back button

**Design Requirements:**
- Clean, focused interface
- Clear connection status (connected/disconnected with mystical indicators)
- Smooth loading states
- Elegant room ID display (copyable, styled)
- Waiting animations (subtle pulse, shimmer)
- Consistent with main setup screen

#### E. Help/Instructions (Help.jsx)
**Elements:**
- Game rules explanation
- How to play instructions
- Visual examples (if possible)
- Close button

**Design Requirements:**
- Modal or slide-in panel
- Easy to read, well-structured
- Mystical styling consistent with game
- Smooth open/close animations
- Clear typography hierarchy

#### F. Navigation & Actions
**Elements:**
- New game button
- Back to setup button
- Help button
- Series reset (if applicable)

**Design Requirements:**
- Consistent button styling throughout
- Clear hover/active states
- Smooth transitions
- Mystical glow on primary actions
- Accessible and touch-friendly

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
- Duration: 300-400ms

**Token Movement:**
- Smooth slide animation from source to destination
- Slight arc or curve for elegance
- Glow trail effect (optional, mystical)
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
- Win celebration: Enhanced glow, pulse, possible particle effect (subtle)

**Loading States:**
- Subtle shimmer or pulse
- Smooth spinner (if needed)
- Mystical glow effect

### 6. Visual Effects & Details

**Glassmorphism (Optional):**
- Subtle frosted glass effect on cards/modals
- Slight transparency with backdrop blur
- Maintains readability

**Shadows & Depth:**
- Soft, layered shadows for depth
- Elevated surfaces (cards, buttons)
- Mystical glow shadows (colored, soft)

**Gradients (Subtle):**
- Background gradients (if used, keep subtle)
- Button gradients (optional, elegant)
- Token glow gradients

**Borders & Outlines:**
- Rounded corners throughout (modern feel)
- Subtle borders or no borders (clean)
- Glow outlines for selected/active states

### 7. Responsive Design Considerations

**Mobile-First Approach:**
- Touch-friendly targets (min 44x44px)
- Adequate spacing for fingers
- Readable text sizes
- Stacked layouts on small screens
- Optimized board size for mobile screens

**Tablet Optimization:**
- Balanced layout (not too cramped, not too spread)
- Comfortable touch targets
- Optimal use of screen space

**Desktop Enhancement:**
- More generous spacing
- Hover states (not just touch)
- Keyboard navigation support
- Larger board if desired

**Future Mobile App Considerations:**
- Design should translate well to native mobile
- Consider native mobile patterns (bottom sheets, swipe gestures)
- Maintain design consistency across platforms

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

