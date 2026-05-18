import Phaser from 'phaser';

export default class RoundedButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, text, color, onClick) {
        super(scene, x, y);
        this.scene = scene;
        
        // Shadow
        const shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.2);
        shadow.fillRoundedRect(-width/2 + 4, -height/2 + 8, width, height, height/3);
        this.add(shadow);

        // Border (darker version of color or white)
        const border = scene.add.graphics();
        border.fillStyle(0xFFFFFF, 1);
        border.fillRoundedRect(-width/2 - 4, -height/2 - 4, width + 8, height + 8, (height+8)/3);
        this.add(border);

        // Main Body
        const bodyColor = Phaser.Display.Color.HexStringToColor(color).color;
        const body = scene.add.graphics();
        body.fillStyle(bodyColor, 1);
        body.fillRoundedRect(-width/2, -height/2, width, height, height/3);
        this.add(body);

        // Highlight
        const highlight = scene.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);
        highlight.fillRoundedRect(-width/2 + 8, -height/2 + 4, width - 16, height/3, height/6);
        this.add(highlight);

        // Text
        const btnText = scene.add.text(0, 0, text, {
            fontFamily: 'Fredoka One',
            fontSize: `${height * 0.4}px`,
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.add(btnText);

        // Interactive hit area
        const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // Animations
        this.on('pointerdown', () => {
            scene.tweens.add({
                targets: this,
                scaleX: 0.9,
                scaleY: 0.9,
                y: this.y + 4,
                duration: 100,
                ease: 'Power2'
            });
            // Optional: Play a pop sound here
        });

        this.on('pointerup', () => {
            scene.tweens.add({
                targets: this,
                scaleX: 1.05,
                scaleY: 1.05,
                y: this.y - 4,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
                onComplete: () => {
                    this.setScale(1);
                    if(onClick) onClick();
                }
            });
        });

        this.on('pointerover', () => {
            scene.tweens.add({
                targets: this,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Back.easeOut'
            });
            scene.input.setDefaultCursor('pointer');
        });

        this.on('pointerout', () => {
            scene.tweens.add({
                targets: this,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Back.easeOut'
            });
            scene.input.setDefaultCursor('default');
        });

        scene.add.existing(this);
    }
}
