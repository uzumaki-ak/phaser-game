PROJECT GOAL:
Build a polished children's coding adventure game using Phaser 3.

IMPORTANT:
This should NOT look like an AI-generated demo.
NO emojis as main art.
NO single-file messy structure.
NO dark corporate gradients.
NO SVG emoji placeholders.
NO giant empty UI spaces.
NO boring educational-app feel.

The game should feel like:
LEGO + ScratchJr + Mario Wonder + Toca Boca

TARGET:
Children age 6–10

STYLE:
Bright
Toy-like
Colorful
Soft shadows
Rounded corners
Playful animations
Juicy feedback
Simple controls
Highly polished

==================================================
🎨 ART DIRECTION
==================================================

COLOR PALETTE:
- Sky Blue: #8ED6FF
- Sunny Yellow: #FFD93D
- Candy Pink: #FF8FAB
- Mint Green: #95E1A3
- Soft Orange: #FFB84C
- Cream White: #FFF8E7
- Purple Accent: #9B5DE5

BACKGROUND:
NOT dark blue.

Use:
- pastel sky gradient
- animated clouds
- parallax hills
- candy trees
- floating particles
- birds flying slowly

GAME FEEL:
Everything should bounce slightly.
Buttons should squish on click.
Robot should idle bounce.

==================================================
📁 REQUIRED FOLDER STRUCTURE
==================================================

project-root/

├── index.html
├── package.json
├── vite.config.js
├── public/
│
├── src/
│   ├── main.js
│   ├── game/
│   │
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── LevelScene.js
│   │   ├── UIScene.js
│   │   └── PreloadScene.js
│   │
│   ├── objects/
│   │   ├── Robot.js
│   │   ├── CommandBlock.js
│   │   ├── GoalStar.js
│   │   └── LevelGrid.js
│   │
│   ├── ui/
│   │   ├── RoundedButton.js
│   │   ├── CommandBar.js
│   │   ├── Popup.js
│   │   └── ConfettiSystem.js
│   │
│   ├── levels/
│   │   ├── level1.json
│   │   ├── level2.json
│   │   ├── level3.json
│   │   └── level4.json
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── robot/
│   │   │   ├── blocks/
│   │   │   ├── ui/
│   │   │   ├── backgrounds/
│   │   │   └── particles/
│   │   │
│   │   ├── audio/
│   │   │   ├── music/
│   │   │   └── sfx/
│   │   │
│   │   └── fonts/
│   │
│   └── utils/
│       ├── constants.js
│       ├── animations.js
│       └── helpers.js

==================================================
🧠 CORE GAMEPLAY
==================================================

PLAYER FLOW:

1. Open game
2. Cute animated menu appears
3. Press PLAY
4. Enter level
5. Drag coding blocks into command slots
6. Press giant RUN button
7. Robot executes commands one-by-one
8. Reach goal star
9. Win animation + confetti
10. Unlock next level

==================================================
🤖 ROBOT DESIGN
==================================================

DO NOT USE:
- emojis
- SVG blob face
- placeholder shapes

CREATE:
A proper sprite-based robot.

ROBOT LOOK:
- square head
- glowing blue eyes
- little antenna
- wheel feet
- small backpack jet
- cute proportions

ROBOT ANIMATIONS:
- idle bounce
- walk cycle
- jump
- celebrate spin
- sad shake
- blink animation

Robot should feel ALIVE.

==================================================
🧱 COMMAND BLOCK SYSTEM
==================================================

BLOCK TYPES:

1. MOVE
2. TURN LEFT
3. TURN RIGHT
4. JUMP
5. LASER
6. REPEAT

BLOCK STYLE:
- toy magnetic blocks
- gradient fills
- thick outline
- glossy top highlight
- shadow underneath
- icon + text

INTERACTION:
- draggable
- hover bounce
- snap into slots
- wiggle if invalid
- glow when selected

SLOT SYSTEM:
- bottom coding bar
- max 6 slots early game
- expandable later

==================================================
🎮 LEVEL DESIGN
==================================================

LEVEL 1:
Teach MOVE

LEVEL 2:
Teach LEFT + RIGHT

LEVEL 3:
Introduce holes and JUMP

LEVEL 4:
Collect stars before exit

LEVEL 5:
Laser destroys obstacle

LEVEL 6:
Use REPEAT loop

==================================================
✨ GAME JUICE
==================================================

VERY IMPORTANT:
This is what separates average from impressive.

ADD:

1. Screen shake on collision
2. Confetti explosion on win
3. Sparkle particles
4. Floating stars
5. Squash/stretch animations
6. Hover scaling
7. Sound feedback
8. Tweened movement
9. Camera zoom on level complete
10. Robot trail particles

EVERY interaction must feel satisfying.

==================================================
🎵 AUDIO
==================================================

BACKGROUND MUSIC:
- cheerful ukulele
- xylophone
- toy percussion

SFX:
- pop
- boing
- click
- sparkle
- success chime

DO NOT use:
- generic beep sounds
- robotic error tones

==================================================
📱 UI DESIGN
==================================================

TOP BAR:
- level number
- collected stars
- pause button

BOTTOM:
- coding slots
- draggable blocks
- giant RUN button

BUTTON STYLE:
- rounded
- thick border
- soft shadow
- bounce on press

TEXT STYLE:
- playful rounded font
- easy to read
- white with dark outline

==================================================
🌍 ENVIRONMENTS
==================================================

WORLD 1:
Candy Hills

WORLD 2:
Jungle Temple

WORLD 3:
Cloud Factory

WORLD 4:
Space Playground

Each world should:
- have different colors
- different particles
- different music
- different obstacles

==================================================
⚙️ TECHNICAL REQUIREMENTS
==================================================

ENGINE:
Phaser 3

BUILD TOOL:
Vite

USE:
- Scene system
- Arcade Physics
- Tilemaps
- Tweens
- Containers
- Particle Emitters
- Sprite sheets

RESPONSIVE:
Must scale properly on:
- desktop
- tablet
- mobile

==================================================
🚫 IMPORTANT RESTRICTIONS
==================================================

DO NOT:
- put everything in one HTML file
- use emoji art
- use giant empty spaces
- use dark corporate gradients
- use placeholder rectangles
- make flat boring UI
- use default browser fonts
- teleport robot instantly
- use AI-looking SVG placeholders

==================================================
✅ WHAT SHOULD IMPRESS INTERVIEWER
==================================================

The project should immediately communicate:
- polish
- game feel
- child-friendly UX
- clean architecture
- scalable system
- animation knowledge
- Phaser understanding

The game should feel like:
"small indie educational game"
NOT:
"school assignment"

==================================================
🔥 BONUS FEATURES
==================================================

IF POSSIBLE ADD:

1. Sticker rewards
2. Unlockable robot skins
3. Voice narration
4. Daily challenge
5. Sandbox level editor
6. Achievement system
7. Save progress in localStorage

==================================================
🎯 FINAL EXPECTATION
==================================================

When opening the game,
the first impression should be:

"WOW this actually feels like a real children's game."

NOT:
"AI generated Phaser tutorial."