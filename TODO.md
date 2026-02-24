# Game Development Plan: Pria Sawit

## Project Overview
Create a browser-based game called "Pria Sawit" (Oil Palm Farmer) themed around oil palm plantation. Players control a palm farmer to collect Fresh Fruit Bunches (TBS) while avoiding obstacles.

## Task Breakdown

### Phase 1: Project Setup
- [ ] Create project folder structure
- [ ] Create SPEC.md with detailed specifications

### Phase 2: HTML Structure (index.html)
- [ ] Main game container (max-width 450px, 80vh)
- [ ] Game screen with oil palm plantation background
- [ ] Farmer character element
- [ ] TBS (Fresh Fruit Bunch) elements (dynamic)
- [ ] Obstacle elements (dynamic)
- [ ] Weather effect element
- [ ] UI Elements:
  - Start screen with title and "MULAI MAIN" button
  - Score board (current score and high score)
  - Status indicator for messages
  - Game over screen with final score and "COBA LAGI" button
  - Mobile controls (left/right buttons)

### Phase 3: CSS Styling (style.css)
- [ ] Color palette:
  - Primary: #2E7D32 (dark green), #81C784 (light green)
  - Brown: #8D6E63 (soil)
  - Accent: #FFC107 (TBS yellow), #FF5722 (obstacle orange)
  - UI: #FFFFFF (white), #424242 (dark gray)
- [ ] Background animations (parallax effect)
- [ ] Farmer character styling with animations
- [ ] TBS styling with animations
- [ ] Obstacles styling (pests, branches, water puddles)
- [ ] Weather effects (rain, heat)
- [ ] UI styling (buttons, score board, screens)
- [ ] Transitions and animations

### Phase 4: JavaScript Logic (game.js)
- [ ] Game initialization
- [ ] Load high score from localStorage
- [ ] Player controls (keyboard arrows + touch buttons)
- [ ] TBS spawning and falling logic
- [ ] Obstacle spawning and movement
- [ ] Collision detection
- [ ] Scoring system (+5 for TBS, -10 for obstacles)
- [ ] Difficulty progression (speed increases every 20 scores)
- [ ] Weather effects activation after score 30
- [ ] Educational messages system
- [ ] Game over conditions
- [ ] Sound effects integration
- [ ] High score persistence

### Phase 5: Testing & Polish
- [ ] Test on different screen sizes
- [ ] Verify all game mechanics work
- [ ] Check educational messages display
- [ ] Verify sound effects work

## Technical Requirements
- Single HTML file with embedded CSS and JS for simplicity
- Responsive design (mobile-friendly)
- No external dependencies (vanilla JS)
- Use requestAnimationFrame for smooth animations
- localStorage for high score persistence

## Game Flow
1. Start Screen → Click "MULAI MAIN"
2. Gameplay → Collect TBS, avoid obstacles
3. Game Over → Score < 0 or multiple hits → Show final score + educational message
4. Retry → Click "COBA LAGI" → Restart game
