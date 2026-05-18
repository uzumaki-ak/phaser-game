import Phaser from 'phaser';

export default class CommandBlock extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type) {
        super(scene, x, y);
        this.scene = scene;
        this.type = type;

        const colors = {
            'FORWARD': '#95E1A3', // Green
            'LEFT': '#FFD93D',    // Yellow
            'RIGHT': '#FFD93D',   // Yellow
            'JUMP': '#9B5DE5',    // Purple
            'REPEAT': '#FF8FAB'   // Pink
        };

        const icons = {
            'FORWARD': '↑',
            'LEFT': '↶',
            'RIGHT': '↷',
            'JUMP': '⇡',
            'REPEAT': '↻'
        };

        this.width = 100;
        this.height = 100;
        this.color = colors[type] || '#FFFFFF';

        // Shadow
        const shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.2);
        shadow.fillRoundedRect(-this.width/2 + 4, -this.height/2 + 6, this.width, this.height, 12);
        this.add(shadow);

        // Base block
        this.bg = scene.add.graphics();
        this.drawBlock(false);
        this.add(this.bg);

        // Highlight top edge
        const highlight = scene.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.4);
        highlight.fillRoundedRect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height/4, 8);
        this.add(highlight);

        // Icon
        const text = scene.add.text(0, -10, icons[type], {
            fontFamily: 'Nunito',
            fontSize: '40px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add(text);

        // Label
        const label = scene.add.text(0, 25, type, {
            fontFamily: 'Fredoka One',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add(label);

        // Interactive
        const hitArea = new Phaser.Geom.Rectangle(-this.width/2, -this.height/2, this.width, this.height);
        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        scene.input.setDraggable(this);

        this.originalX = x;
        this.originalY = y;
        this.slot = null;

        // Drag events are handled in LevelScene usually, but we can add effects here
        this.on('pointerover', () => {
            if (!this.scene.isExecuting) {
                this.scene.tweens.add({ targets: this, scaleX: 1.05, scaleY: 1.05, duration: 100 });
                scene.input.setDefaultCursor('grab');
            }
        });
        this.on('pointerout', () => {
            if (!this.scene.isExecuting) {
                this.scene.tweens.add({ targets: this, scaleX: 1, scaleY: 1, duration: 100 });
                scene.input.setDefaultCursor('default');
            }
        });

        scene.add.existing(this);
    }

    drawBlock(isHover) {
        this.bg.clear();
        const baseColor = Phaser.Display.Color.HexStringToColor(this.color).color;
        
        // Border
        this.bg.lineStyle(4, 0x000000, 1);
        this.bg.strokeRoundedRect(-this.width/2, -this.height/2, this.width, this.height, 12);
        
        // Fill
        this.bg.fillStyle(baseColor, 1);
        this.bg.fillRoundedRect(-this.width/2, -this.height/2, this.width, this.height, 12);

        // Peg (top connection)
        this.bg.fillStyle(baseColor, 1);
        this.bg.fillRoundedRect(-15, -this.height/2 - 10, 30, 20, 6);
        this.bg.lineStyle(4, 0x000000, 1);
        this.bg.strokeRoundedRect(-15, -this.height/2 - 10, 30, 20, 6);
    }

    returnToOriginal() {
        this.scene.tweens.add({
            targets: this,
            x: this.originalX,
            y: this.originalY,
            duration: 300,
            ease: 'Back.easeOut'
        });
        this.slot = null;
    }
}
