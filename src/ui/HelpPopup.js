import Phaser from 'phaser';
import RoundedButton from './RoundedButton.js';
import { audio } from '../utils/AudioManager.js';

export default class HelpPopup extends Phaser.GameObjects.Container {
    constructor(scene) {
        const { width, height } = scene.scale;
        super(scene, width / 2, height / 2);
        
        // Full screen dark overlay
        const overlay = scene.add.graphics();
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(-width / 2, -height / 2, width, height);
        this.add(overlay);

        // Interactive block to prevent clicks behind it
        overlay.setInteractive(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), Phaser.Geom.Rectangle.Contains);

        // Panel background
        const panelWidth = Math.min(600, width * 0.9);
        const panelHeight = Math.min(400, height * 0.8);
        const panel = scene.add.graphics();
        
        // Shadow
        panel.fillStyle(0x000000, 0.2);
        panel.fillRoundedRect(-panelWidth/2 + 8, -panelHeight/2 + 8, panelWidth, panelHeight, 24);
        
        // Body
        panel.fillStyle(0xFFF8E7, 1);
        panel.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 24);
        panel.lineStyle(6, 0xFF8FAB, 1);
        panel.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 24);
        this.add(panel);

        // Title
        const title = scene.add.text(0, -panelHeight/2 + 40, 'HOW TO PLAY', {
            fontFamily: 'Fredoka One',
            fontSize: '36px',
            fill: '#9B5DE5',
            stroke: '#FFF',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.add(title);

        // Instructions
        const textContent = 
            "1. Drag coding blocks from the\nbottom right into the empty slots.\n" +
            "2. Read the level hint!\n" +
            "3. Click RUN! to watch your robot go.\n" +
            "4. Save the Puppy to win!";
            
        const info = scene.add.text(0, 0, textContent, {
            fontFamily: 'Nunito',
            fontSize: '24px',
            fill: '#333',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        this.add(info);

        // Close Button
        const closeBtn = new RoundedButton(scene, 0, panelHeight/2 - 50, 160, 60, 'GOT IT!', '#95E1A3', () => {
            audio.playPop();
            scene.tweens.add({
                targets: this,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 200,
                ease: 'Back.easeIn',
                onComplete: () => this.destroy()
            });
        });
        this.add(closeBtn);

        // Animate in
        this.setScale(0);
        this.setAlpha(0);
        scene.add.existing(this);
        
        scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
}
