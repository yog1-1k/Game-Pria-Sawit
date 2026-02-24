# SPEC.md - Pria Sawit Game

## 1. Project Overview
- **Project Name**: Pria Sawit (Oil Palm Farmer)
- **Type**: Browser-based arcade game
- **Core Functionality**: Players control a palm farmer to collect Fresh Fruit Bunches (TBS) while avoiding obstacles in an oil palm plantation
- **Target Users**: General audience, especially Indonesian players interested in agricultural games

## 2. UI/UX Specification

### Layout Structure
- **Container**: Centered, max-width 450px, height 80vh (max 600px)
- **Game Screen**: Full container, oil palm plantation background
- **Controls**: Fixed bottom, 70x70px touch buttons for mobile
- **Score Board**: Fixed top, semi-transparent background

### Visual Design

#### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary Dark Green | Palm trees | #2E7D32 |
| Primary Light Green | Leaves | #81C784 |
| Soil Brown | Ground | #8D6E63 |
| TBS Yellow | Fruit bunch | #FFC107 |
| Obstacle Orange | Pests | #FF5722 |
| Water Blue | Puddles | #B3E5FC |
| Branch Brown | Wood | #5D4037 |
| UI White | Text | #FFFFFF |
| UI Dark Gray | UI BG | #424242 |
| Button Green | Active | #1B5E20 |
| Sky Blue | Clear day | #E3F2FD |
| Sky Gray | Rainy | #BDBDBD |

#### Typography
- **Font Family**: 'Segoe UI', Tahoma, sans-serif
- **Title**: 32px, bold, white with dark shadow
- **Score**: 28px, bold
- **Buttons**: 18px, bold
- **Messages**: 16px, regular

#### Spacing
- Container padding: 0
- Button margin: 10px
- Element gaps: 8px

### Components

#### Start Screen
- Dark overlay (rgba(0,0,0,0.85))
- Game title "PRIA SAWIT" with palm tree icon
- Subtitle: "Siaga Ambil TBS – Jaga Kualitas Hasil Panen!"
- "MULAI MAIN" button (green, rounded)
- Brief game instructions

#### Game Screen
- Parallax background (3 layers: sky, distant palms, ground)
- Farmer character (center-bottom)
- Falling TBS objects (yellow circles)
- Falling obstacles (orange pests, brown branches, blue puddles)
- Weather overlay (rain drops or heat waves)

#### Score Board
- Top-left: Current score with icon
- Top-right: High score with trophy icon
- Background: semi-transparent dark

#### Status Indicator
- Center-top floating message
- Shows educational tips briefly
- Fade in/out animation

#### Game Over Screen
- Dark overlay
- "GAME OVER" title
- Final score display
- Educational message about oil palm farming
- "COBA LAGI" button
- High score notification if beaten

#### Mobile Controls
- Two buttons at bottom
- Left arrow / Right arrow
- Min 70x70px, rounded corners
- Visual feedback on press

## 3. Functionality Specification

### Core Features

#### Player Movement
- Horizontal movement only
- Speed: 8px per frame
- Boundary: Cannot leave the road area
- Controls: Arrow keys (desktop), touch buttons (mobile)

#### TBS (Fresh Fruit Bunch) Objects
- Spawn: Random X position, top of screen
- Fall speed: Starts at 3px/frame, increases 10% every 20 scores
- Points: +5 per collection
- Visual: Yellow/orange circle with texture
- Collection effect: Flash + sound

#### Obstacles
- Three types:
  1. **Hama (Pests)**: Orange circles, moving side-to-side
  2. **Cabang Kayu (Branches)**: Brown rectangles
  3. **Genangan Air (Water)**: Blue ovals
- Spawn: Random type, random X position
- Fall speed: Same as TBS
- Penalty: -10 points per hit
- Consecutive hits: Game over if 3 hits within 2 seconds

#### Collision Detection
- Rectangle-based collision
- Farmer hitbox: 40x60px
- TBS hitbox: 30x30px
- Obstacle hitbox: varies by type

#### Difficulty Progression
- Level 1 (0-19 score): Base speed, few obstacles
- Level 2 (20-49 score): +10% speed, more obstacles
- Level 3 (50+ score): +20% speed, frequent obstacles

#### Weather Effects
- **Rain**: Activates at score 30, increases fall speed by 15%
- **Heat**: Activates at score 50, TBS turns brown faster (miss if not collected in time)
- Toggle between rain/heat randomly every 10 seconds

#### Educational Messages
- On TBS collection: "TBS segar = minyak berkualitas!"
- On obstacle hit: "Hama merusak TBS! Stay alert!"
- On game over: "Petani sawit bekerja keras untuk kita!"
- Random tips during gameplay

#### High Score
- Stored in localStorage
- Displayed on start screen and game over
- Celebration animation when beaten

### User Interactions
1. Click "MULAI MAIN" → Game starts
2. Press left/right → Farmer moves
3. Touch left/right button → Farmer moves
4. Collect TBS → Score increases
5. Hit obstacle → Score decreases, screen shake
6. Score < 0 → Game over
7. Click "COBA LAGI" → Restart game

### Edge Cases
- Window resize: Recalculate boundaries
- Tab inactive: Pause game
- Touch and keyboard: Support both simultaneously
- Rapid clicking: Debounce start/restart buttons

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Game loads with start screen visible
- [ ] Title "PRIA SAWIT" is clearly readable
- [ ] Start button is green and clickable
- [ ] Background shows oil palm plantation theme
- [ ] Farmer character is visible and recognizable
- [ ] TBS objects are yellow and round
- [ ] Obstacles are visually distinct (3 types)
- [ ] Score board shows current and high score
- [ ] Mobile controls appear on smaller screens

### Functional Checkpoints
- [ ] Game starts when "MULAI MAIN" clicked
- [ ] Farmer moves left/right with controls
- [ ] TBS falls from top of screen
- [ ] Collecting TBS increases score by 5
- [ ] Hitting obstacle decreases score by 10
- [ ] Game over triggers when score < 0
- [ ] High score saves to localStorage
- [ ] "COBA LAGI" restarts the game
- [ ] Educational messages display correctly

### Performance Checkpoints
- [ ] Smooth 60fps animation
- [ ] No lag on mobile devices
- [ ] Responsive to window size
