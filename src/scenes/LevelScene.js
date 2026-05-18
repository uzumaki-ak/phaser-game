import Phaser from 'phaser';
import Robot from '../objects/Robot.js';
import CommandBlock from '../objects/CommandBlock.js';
import RoundedButton from '../ui/RoundedButton.js';
import HelpPopup from '../ui/HelpPopup.js';
import { audio } from '../utils/AudioManager.js';

export default class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
        this.levels = [
            {
                title: "Level 1: Save the Puppy!",
                gridWidth: 5, gridHeight: 3,
                robotStart: { x: 0, y: 1 },
                goal: { x: 4, y: 1 },
                blocks: ['FORWARD', 'FORWARD', 'FORWARD', 'FORWARD'],
                maxSlots: 4,
                tutorial: "Help Robo Hero reach the lost puppy!"
            },
            {
                title: "Level 2: Backroad Rescue",
                gridWidth: 5, gridHeight: 4,
                robotStart: { x: 0, y: 0 },
                goal: { x: 2, y: 2 },
                blocks: ['FORWARD', 'FORWARD', 'RIGHT', 'FORWARD', 'FORWARD', 'LEFT'],
                maxSlots: 6,
                tutorial: "Help Robo Hero navigate the backyard!",
                timeLimit: 60
            },
            {
                title: "Level 3: Across the Gap",
                gridWidth: 6, gridHeight: 3,
                robotStart: { x: 0, y: 1 },
                goal: { x: 5, y: 1 },
                holes: [{x: 2, y: 1}],
                blocks: ['FORWARD', 'JUMP', 'FORWARD', 'FORWARD'],
                maxSlots: 4,
                tutorial: "Leap over the candy gap to save the puppy!",
                timeLimit: 90
            }
        ];
        this.currentLevelIndex = 0;
    }

    init(data) {
        this.currentLevelIndex = data && data.levelIndex !== undefined ? data.levelIndex : this.currentLevelIndex;
        // Safety bounds
        if (this.currentLevelIndex >= this.levels.length) this.currentLevelIndex = 0;
    }

    create() {
        const { width, height } = this.scale;
        
        // Setup variables
        this.isExecuting = false;
        this.isGameOver = false;
        this.puppyRescued = false;
        this.commandSlots = [];
        this.availableBlocks = [];
        this.levelData = this.levels[this.currentLevelIndex];

        // Background
        const bg = this.add.image(width / 2, height / 2, 'background');
        // Scale bg to cover the screen
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        bg.setScale(Math.max(scaleX, scaleY));
        
        // Add ambient particles for life
        const particles = this.add.particles(0, 0, 'sparkle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 4000,
            speedY: { min: -10, max: -30 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            frequency: 300
        });

        // Top UI
        this.add.text(20, 20, this.levelData.title, {
            fontFamily: 'Fredoka One', fontSize: '32px', fill: '#FFF', stroke: '#000', strokeThickness: 6
        });

        if (this.levelData.tutorial) {
            this.add.text(width / 2, 80, this.levelData.tutorial, {
                fontFamily: 'Nunito', fontSize: '24px', fill: '#FFF', stroke: '#000', strokeThickness: 4
            }).setOrigin(0.5);
        }

        // Timer
        this.timeLeft = this.levelData.timeLimit || 45;
        this.timerText = this.add.text(width / 2, 40, `⏱️ ${this.timeLeft}`, {
            fontFamily: 'Fredoka One', fontSize: '36px', fill: '#FFF', stroke: '#EF4444', strokeThickness: 6
        }).setOrigin(0.5);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.isExecuting || this.isGameOver) return;
                this.timeLeft--;
                this.timerText.setText(`⏱️ ${this.timeLeft}`);
                if (this.timeLeft <= 0) {
                    this.failLevel(true);
                }
            },
            callbackScope: this,
            loop: true
        });

        // Voice narration on Level Start!
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSpeak = `${this.levelData.title}. ${this.levelData.tutorial}`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 1.0;
            utterance.pitch = 1.1; // Cute, child-friendly pitch
            window.speechSynthesis.speak(utterance);
        }

        // Top Right UI Buttons
        this.helpBtn = new RoundedButton(this, width - 240, 60, 80, 80, '?', '#9B5DE5', () => {
            audio.playPop();
            new HelpPopup(this);
        });

        this.resetBtn = new RoundedButton(this, width - 150, 60, 80, 80, '↺', '#FFD93D', () => {
            audio.playPop();
            this.scene.restart();
        });

        this.pauseBtn = new RoundedButton(this, width - 60, 60, 80, 80, '❚❚', '#FF8FAB', () => {
            if (this.isGameOver) return;
            audio.playPop();
            this.scene.pause();
            this.scene.launch('PauseOverlay');
        });

        // Draw Grid
        this.gridSize = 80;
        this.gridStartX = width / 2 - (this.levelData.gridWidth * this.gridSize) / 2 + this.gridSize / 2;
        this.gridStartY = height / 2 - (this.levelData.gridHeight * this.gridSize) / 2 - 50;
        
        this.tiles = [];
        for (let y = 0; y < this.levelData.gridHeight; y++) {
            for (let x = 0; x < this.levelData.gridWidth; x++) {
                // Check for hole
                let isHole = this.levelData.holes && this.levelData.holes.find(h => h.x === x && h.y === y);
                if (!isHole) {
                    const tile = this.add.sprite(this.gridStartX + x * this.gridSize, this.gridStartY + y * this.gridSize, 'tile');
                    this.tiles.push({x, y, sprite: tile});
                } else {
                    const holeGraphics = this.add.graphics();
                    holeGraphics.fillStyle(0x000000, 0.3);
                    holeGraphics.fillRoundedRect(this.gridStartX + x * this.gridSize - 35, this.gridStartY + y * this.gridSize - 35, 70, 70, 12);
                }
            }
        }

        // Draw Rescued Puppy
        this.goal = this.add.sprite(
            this.gridStartX + this.levelData.goal.x * this.gridSize,
            this.gridStartY + this.levelData.goal.y * this.gridSize,
            'puppy_happy'
        );
        this.tweens.add({
            targets: this.goal,
            y: this.goal.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add Robot
        const robStart = this.levelData.robotStart;
        this.robot = new Robot(this, this.gridStartX + robStart.x * this.gridSize, this.gridStartY + robStart.y * this.gridSize + this.gridSize / 2);

        // UI Command Bar Area
        const barBg = this.add.graphics();
        // Drop shadow for the tray
        barBg.fillStyle(0x000000, 0.2);
        barBg.fillRoundedRect(width * 0.05 + 4, height - 200 + 8, width * 0.9, 180, 24);
        
        // Main tray body (Mint green/blue pastel)
        barBg.fillStyle(0xFFF8E7, 0.95);
        barBg.fillRoundedRect(width * 0.05, height - 200, width * 0.9, 180, 24);
        barBg.lineStyle(6, 0x8ED6FF, 1);
        barBg.strokeRoundedRect(width * 0.05, height - 200, width * 0.9, 180, 24);
        
        // Gloss highlight
        barBg.fillStyle(0xFFFFFF, 0.5);
        barBg.fillRoundedRect(width * 0.05 + 6, height - 194, width * 0.9 - 12, 20, 10);

        // Slots
        const slotWidth = 110;
        const totalSlotsWidth = this.levelData.maxSlots * slotWidth;
        const slotsStartX = width / 2 - totalSlotsWidth / 2 + slotWidth / 2;
        const slotsY = height - 140;

        for (let i = 0; i < this.levelData.maxSlots; i++) {
            const slot = this.add.graphics();
            // Inset shadow for slot
            slot.fillStyle(0x000000, 0.1);
            slot.fillRoundedRect(slotsStartX + i * slotWidth - 50, slotsY - 50, 100, 100, 16);
            slot.lineStyle(4, 0xD1D5DB, 1);
            slot.strokeRoundedRect(slotsStartX + i * slotWidth - 50, slotsY - 50, 100, 100, 16);
            
            this.commandSlots.push({
                x: slotsStartX + i * slotWidth,
                y: slotsY,
                block: null,
                rect: new Phaser.Geom.Rectangle(slotsStartX + i * slotWidth - 50, slotsY - 50, 100, 100)
            });
        }

        // Available Blocks (Palette)
        const paletteY = height - 50;
        const paletteStartX = width / 2 - (this.levelData.blocks.length * 110) / 2 + 55;
        
        this.levelData.blocks.forEach((type, index) => {
            const block = new CommandBlock(this, paletteStartX + index * 110, paletteY, type);
            block.setScale(0.8);
            this.availableBlocks.push(block);
        });

        // Run Button
        this.runBtn = new RoundedButton(this, width - 150, height - 110, 180, 100, 'RUN!', '#95E1A3', () => {
            audio.playPop();
            this.executeRun();
        });
        
        // Resize handler to ensure full screen stays centered
        this.scale.on('resize', this.resize, this);

        // Drag and Drop Logic
        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.isExecuting) return;
            this.children.bringToTop(gameObject);
            gameObject.setScale(1);
            if (gameObject.slot) {
                gameObject.slot.block = null;
                gameObject.slot = null;
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.isExecuting) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (this.isExecuting) return;
            // Check snap to slot
            let snapped = false;
            for (let slot of this.commandSlots) {
                if (Phaser.Geom.Rectangle.Contains(slot.rect, gameObject.x, gameObject.y)) {
                    // Snap!
                    if (slot.block) {
                        // Return existing block to palette
                        slot.block.returnToOriginal();
                        slot.block.setScale(0.8);
                    }
                    gameObject.x = slot.x;
                    gameObject.y = slot.y;
                    gameObject.setScale(1);
                    gameObject.slot = slot;
                    slot.block = gameObject;
                    snapped = true;
                    // Play snap sound
                    audio.playSnap();
                    break;
                }
            }
            if (!snapped) {
                gameObject.returnToOriginal();
                gameObject.setScale(0.8);
            }
        });
    }

    executeRun() {
        if (this.isExecuting) return;
        
        const commands = [];
        for (let slot of this.commandSlots) {
            if (slot.block) commands.push(slot.block.type);
        }

        if (commands.length === 0) return;

        this.isExecuting = true;
        this.robot.reset(this.gridStartX + this.levelData.robotStart.x * this.gridSize, this.gridStartY + this.levelData.robotStart.y * this.gridSize + this.gridSize / 2);

        this.robot.executeCommands(commands, this.levelData, (success) => {
            // Check win condition
            const gridX = Math.round((this.robot.x - this.gridStartX) / this.gridSize);
            const gridY = Math.round((this.robot.y - this.gridSize / 2 - this.gridStartY) / this.gridSize);

            if (gridX === this.levelData.goal.x && gridY === this.levelData.goal.y) {
                this.winLevel();
            } else {
                this.failLevel();
            }
        });
    }

    winLevel() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        
        // Play cute bark and win chime
        audio.playBark();
        audio.playWin();
        
        this.robot.celebrate();
        this.cameras.main.zoomTo(1.2, 1000, 'Sine.easeInOut');
        
        // Puppy leaps onto robot's head!
        this.puppyRescued = false;
        this.tweens.add({
            targets: this.goal,
            x: this.robot.x,
            y: this.robot.y - 70,
            scaleX: 0.7,
            scaleY: 0.7,
            angle: 360,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.puppyRescued = true;
            }
        });
        
        // Heart Confetti!
        const emitter = this.add.particles(this.robot.x, this.robot.y - 45, 'heart', {
            speed: { min: 200, max: 400 },
            angle: { min: 200, max: 340 },
            gravityY: 400,
            scale: { start: 1.5, end: 0 },
            lifespan: 2000,
            quantity: 50
        });
        emitter.explode();

        this.time.delayedCall(2000, () => {
            this.scene.pause();
            const timeLimit = this.levelData.timeLimit || 45;
            const timeTaken = timeLimit - this.timeLeft;
            this.scene.launch('GameOverOverlay', { isWin: true, levelIndex: this.currentLevelIndex, timeTaken });
        });
    }

    failLevel(isTimeout = false) {
        if (this.isGameOver) return;
        this.isGameOver = true;
        
        // Puppy becomes sad and whimpers
        this.goal.setTexture('puppy_sad');
        audio.playWhimper();
        audio.playLose();
        
        this.cameras.main.shake(300, 0.01);
        this.time.delayedCall(1000, () => {
            this.scene.pause();
            this.scene.launch('GameOverOverlay', { isWin: false, levelIndex: this.currentLevelIndex, isTimeout });
        });
    }

    update() {
        // Keep rescued puppy perfectly on top of robot's head during victory dance
        if (this.puppyRescued && this.goal && this.robot) {
            this.goal.x = this.robot.x;
            this.goal.y = this.robot.y - 70;
            this.goal.angle = this.robot.angle;
            this.goal.scaleX = 0.7;
            this.goal.scaleY = 0.7;
        }
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.resize(width, height);
        // We could reposition elements here, but restarting the scene is cleaner for full layout rebuild
        // this.scene.restart();
    }
}
