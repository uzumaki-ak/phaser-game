import Phaser from 'phaser';
import RoundedButton from '../ui/RoundedButton.js';
import { audio } from '../utils/AudioManager.js';

export default class GameOverOverlay extends Phaser.Scene {
    constructor() {
        super('GameOverOverlay');
    }

    init(data) {
        this.isWin = data.isWin;
        this.levelIndex = data.levelIndex;
        this.timeTaken = data.timeTaken || 0;
        this.isTimeout = data.isTimeout || false;
    }

    create() {
        const { width, height } = this.scale;
        
        // Dark overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, width, height);

        // Panel
        const panelWidth = 500;
        const panelHeight = 400;
        const panel = this.add.graphics();
        
        panel.fillStyle(0x000000, 0.2);
        panel.fillRoundedRect(width/2 - panelWidth/2 + 8, height/2 - panelHeight/2 + 8, panelWidth, panelHeight, 24);
        
        panel.fillStyle(0xFFF8E7, 1);
        panel.fillRoundedRect(width/2 - panelWidth/2, height/2 - panelHeight/2, panelWidth, panelHeight, 24);
        
        const borderColor = this.isWin ? 0x95E1A3 : 0xFF8FAB;
        panel.lineStyle(8, borderColor, 1);
        panel.strokeRoundedRect(width/2 - panelWidth/2, height/2 - panelHeight/2, panelWidth, panelHeight, 24);

        // Title
        const titleText = this.isWin ? 'RESULTS' : (this.isTimeout ? 'TIME UP!' : 'TRY AGAIN!');
        const titleColor = this.isWin ? '#C2225A' : '#FF8FAB';

        const title = this.add.text(width/2, height/2 - 150, titleText, {
            fontFamily: 'Fredoka One',
            fontSize: '56px',
            fill: '#E4F8FF',
            stroke: titleColor,
            strokeThickness: 10
        }).setOrigin(0.5);

        // Rescued Puppy Icon (Beautiful vector asset, no cheap emojis!)
        const iconKey = this.isWin ? 'puppy_happy' : 'puppy_sad';
        const icon = this.add.sprite(width/2, height/2 - 50, iconKey);
        icon.setScale(1.6);
 
        this.tweens.add({
            targets: icon,
            scaleX: 1.9,
            scaleY: 1.9,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
 
        if (this.isWin) {
            // Stats Text
            this.add.text(width/2, height/2 + 30, `Time Taken: ${this.timeTaken}s`, {
                fontFamily: 'Fredoka One',
                fontSize: '28px',
                fill: '#02265E'
            }).setOrigin(0.5);
            
            this.add.text(width/2, height/2 + 70, 'Accuracy: 100%', {
                fontFamily: 'Fredoka One',
                fontSize: '28px',
                fill: '#02265E'
            }).setOrigin(0.5);
        } else {
            // Lose motivation text
            const loseMsg = this.isTimeout ? "Time ran out to save the puppy!" : "Oops! Robo got stuck. Let's try again!";
            this.add.text(width/2, height/2 + 50, loseMsg, {
                fontFamily: 'Nunito',
                fontSize: '24px',
                fill: '#02265E',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Buttons
        const btnY = height/2 + 140;
        new RoundedButton(this, width/2 - 120, btnY, 140, 60, 'REPLAY', '#FFD93D', () => {
            audio.playPop();
            this.scene.resume('LevelScene');
            this.scene.stop('LevelScene');
            this.scene.start('LevelScene', { levelIndex: this.levelIndex });
        });

        if (this.isWin) {
            new RoundedButton(this, width/2 + 120, btnY, 140, 60, 'NEXT', '#55CC29', () => {
                audio.playPop();
                this.scene.resume('LevelScene');
                this.scene.stop('LevelScene');
                this.scene.start('LevelScene', { levelIndex: this.levelIndex + 1 });
            });
            
            // Save progress
            let maxLevel = parseInt(localStorage.getItem('coding_game_max_level')) || 0;
            if (this.levelIndex + 1 > maxLevel) {
                localStorage.setItem('coding_game_max_level', this.levelIndex + 1);
            }
        } else {
            new RoundedButton(this, width/2 + 120, btnY, 140, 60, 'MENU', '#9B5DE5', () => {
                audio.playPop();
                this.scene.resume('LevelScene');
                this.scene.stop('LevelScene');
                this.scene.start('LevelSelectScene');
            });
        }
        
        // Popup animation
        this.cameras.main.zoom = 0.5;
        this.cameras.main.alpha = 0;
        this.tweens.add({
            targets: this.cameras.main,
            zoom: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
}
