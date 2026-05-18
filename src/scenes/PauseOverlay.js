import Phaser from 'phaser';
import RoundedButton from '../ui/RoundedButton.js';
import { audio } from '../utils/AudioManager.js';

export default class PauseOverlay extends Phaser.Scene {
    constructor() {
        super('PauseOverlay');
    }

    create() {
        const { width, height } = this.scale;
        
        // Dark overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, width, height);

        // Interactive block to prevent clicks behind it
        const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height);
        overlay.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // Panel
        const panelWidth = 400;
        const panelHeight = 400;
        const panel = this.add.graphics();
        
        panel.fillStyle(0x000000, 0.2);
        panel.fillRoundedRect(width/2 - panelWidth/2 + 8, height/2 - panelHeight/2 + 8, panelWidth, panelHeight, 24);
        
        panel.fillStyle(0xFFF8E7, 1);
        panel.fillRoundedRect(width/2 - panelWidth/2, height/2 - panelHeight/2, panelWidth, panelHeight, 24);
        
        panel.lineStyle(8, 0x9B5DE5, 1);
        panel.strokeRoundedRect(width/2 - panelWidth/2, height/2 - panelHeight/2, panelWidth, panelHeight, 24);

        // Title
        this.add.text(width/2, height/2 - 120, 'PAUSED', {
            fontFamily: 'Fredoka One',
            fontSize: '56px',
            fill: '#E4F8FF',
            stroke: '#9B5DE5',
            strokeThickness: 10
        }).setOrigin(0.5);

        // Buttons
        new RoundedButton(this, width/2, height/2 - 20, 200, 60, 'RESUME', '#95E1A3', () => {
            audio.playPop();
            this.scene.stop();
            this.scene.resume('LevelScene');
        });
        
        new RoundedButton(this, width/2, height/2 + 60, 200, 60, 'RESTART', '#FFD93D', () => {
            audio.playPop();
            this.scene.resume('LevelScene');
            this.scene.stop('LevelScene');
            this.scene.start('LevelScene');
        });

        new RoundedButton(this, width/2, height/2 + 140, 200, 60, 'MENU', '#FF8FAB', () => {
            audio.playPop();
            this.scene.resume('LevelScene');
            this.scene.stop('LevelScene');
            this.scene.start('LevelSelectScene');
        });
        
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
