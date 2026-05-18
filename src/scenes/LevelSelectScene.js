import Phaser from 'phaser';
import RoundedButton from '../ui/RoundedButton.js';
import { audio } from '../utils/AudioManager.js';

export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        const { width, height } = this.scale;
        
        // Background
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setScale(Math.max(width / bg.width, height / bg.height));

        this.add.particles(0, 0, 'sparkle', {
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
        this.add.text(width / 2, 100, 'SELECT LEVEL', {
            fontFamily: 'Fredoka One',
            fontSize: '60px',
            fill: '#FFF',
            stroke: '#9B5DE5',
            strokeThickness: 10
        }).setOrigin(0.5);

        // Load progress
        const maxLevel = parseInt(localStorage.getItem('coding_game_max_level')) || 0;
        
        const totalLevels = 3;
        const spacing = 150;
        const startX = width / 2 - ((totalLevels - 1) * spacing) / 2;

        for (let i = 0; i < totalLevels; i++) {
            const isUnlocked = i <= maxLevel;
            const color = isUnlocked ? '#95E1A3' : '#D1D5DB';
            const textColor = isUnlocked ? '#FFF' : '#9CA3AF';
            
            const btn = new RoundedButton(this, startX + i * spacing, height / 2, 100, 100, `${i + 1}`, color, () => {
                if (isUnlocked) {
                    audio.playPop();
                    this.cameras.main.fadeOut(300, 142, 214, 255);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('LevelScene', { levelIndex: i });
                    });
                } else {
                    audio.playLose(); // small buzz for locked
                    this.cameras.main.shake(100, 0.01);
                }
            });

            if (!isUnlocked) {
                // Add a small lock icon or just cross
                this.add.text(startX + i * spacing, height / 2 + 30, '🔒', { fontSize: '20px' }).setOrigin(0.5);
            }
        }

        // Back Button
        new RoundedButton(this, 120, 80, 160, 60, 'BACK', '#FF8FAB', () => {
            audio.playPop();
            this.scene.start('MenuScene');
        });

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        this.cameras.resize(gameSize.width, gameSize.height);
        this.scene.restart();
    }
}
