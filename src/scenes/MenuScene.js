import Phaser from 'phaser';
import RoundedButton from '../ui/RoundedButton.js';
import { audio } from '../utils/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.scale;

        // Background
        const bg = this.add.image(width / 2, height / 2, 'background');
        // Scale bg to cover the screen
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        bg.setScale(Math.max(scaleX, scaleY));

        // Add animated clouds (if they were generated, but we can just use the bg image)
        // Since the bg image already has clouds, we might not need procedural clouds, 
        // but we'll add some slow moving sparkles/particles to make it alive.
        const particles = this.add.particles(0, 0, 'sparkle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 3000,
            speedY: { min: -20, max: -40 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            frequency: 500
        });

        // Title
        const title = this.add.text(width / 2, height / 3, 'ROBO\nHERO', {
            fontFamily: 'Fredoka One',
            fontSize: '85px',
            fill: '#FFF',
            align: 'center',
            stroke: '#9B5DE5',
            strokeThickness: 12
        }).setOrigin(0.5);
 
        // Title float animation
        this.tweens.add({
            targets: title,
            y: title.y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
 
        // Add Robot sprite for decoration
        const robot = this.add.sprite(width / 2, height / 2 + 50, 'robot_sprite');
        
        // Scale down the raw DALL-E image to fit
        robot.setScale(200 / robot.height);
        
        // Robot float bounce
        this.tweens.add({
            targets: robot,
            y: robot.y - 15,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Breathing/Squash effect
        this.tweens.add({
            targets: robot,
            scaleY: (200 / robot.height) * 0.95,
            scaleX: (200 / robot.height) * 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Play Button
        const playBtn = new RoundedButton(this, width / 2, height * 0.76, 240, 80, 'PLAY!', '#95E1A3', () => {
            audio.playPop();
            audio.startBGM();
            
            // Voice narration on Play!
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance("Drag command blocks to guide your cute robot hero to the gold star!");
                utterance.rate = 1.0;
                utterance.pitch = 1.1; // Cute, child-friendly pitch
                window.speechSynthesis.speak(utterance);
            }
 
            // Exit animation
            this.cameras.main.fadeOut(500, 142, 214, 255);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelSelectScene');
            });
        });
 
        // One-sentence Game Description below PLAY button
        const descText = this.add.text(width / 2, height * 0.87, 'Drag command blocks to guide your cute robot hero to the gold star!', {
            fontFamily: 'Nunito',
            fontSize: '18px',
            fill: '#FFF',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 5,
            wordWrap: { width: width * 0.8, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Resize handler
        this.scale.on('resize', this.resize, this);
    }

    update() {
        // No procedural clouds anymore
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.resize(width, height);
        // Clean layout rebuild on resize
        this.scene.restart();
    }
}
