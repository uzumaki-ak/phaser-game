import Phaser from 'phaser';

export default class Robot extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'robot_sprite');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1); // Anchor at bottom center for easy tile placement
        
        // Scale down the raw image
        this.baseScale = 90 / this.height;
        this.setScale(this.baseScale);

        // Idle hover tween
        this.idleTween = scene.tweens.add({
            targets: this,
            scaleY: this.baseScale * 0.96,
            scaleX: this.baseScale * 1.04,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.gridSize = 80;
        this.isExecuting = false;
        this.facing = 1; // 0=Up, 1=Right, 2=Down, 3=Left
    }

    play(animation) {
        // Mock method to prevent breaking old code
        // We handle actual animation procedurally now
    }

    // Reset robot for retry
    reset(x, y, facing = 1) {
        this.setPosition(x, y);
        this.facing = facing;
        this.setAngle(0); // Optional: if we want it to rotate visually
        this.isExecuting = false;
        this.play('idle');
        this.idleTween.resume();
        this.setFlipX(facing === 3);
    }

    async executeCommands(commands, grid, onComplete) {
        this.isExecuting = true;
        this.failed = false;
        this.idleTween.pause();
        this.setScale(this.baseScale); // Reset scale from idle tween

        for (let cmd of commands) {
            await this.runCommand(cmd, grid);
            if (this.failed) break; // If hitting obstacle or hole
        }

        this.play('idle');
        this.idleTween.resume();
        this.isExecuting = false;
        if(onComplete) onComplete(!this.failed);
    }

    runCommand(cmd, grid) {
        return new Promise(resolve => {
            if (cmd === 'FORWARD') {
                // Procedural walk animation
                this.scene.tweens.add({
                    targets: this,
                    angle: { from: -10, to: 10 },
                    yoyo: true,
                    repeat: -1,
                    duration: 100
                });
                
                let dx = 0, dy = 0;
                if (this.facing === 0) dy = -this.gridSize;
                if (this.facing === 1) dx = this.gridSize;
                if (this.facing === 2) dy = this.gridSize;
                if (this.facing === 3) dx = -this.gridSize;

                const targetX = this.x + dx;
                const targetY = this.y + dy;

                // Create trail particles
                const emitter = this.scene.add.particles(this.x, this.y - 40, 'particle', {
                    speed: 50,
                    scale: { start: 1, end: 0 },
                    blendMode: 'ADD',
                    lifespan: 300,
                    frequency: 50
                });

                this.scene.tweens.add({
                    targets: this,
                    x: targetX,
                    y: targetY,
                    duration: 500,
                    ease: 'Quad.easeInOut',
                    onUpdate: () => {
                        emitter.setPosition(this.x, this.y - 40);
                    },
                    onComplete: () => {
                        emitter.stop();
                        // Snap and resolve
                        this.x = targetX;
                        this.y = targetY;
                        
                        this.setAngle(0);
                        this.scene.tweens.killTweensOf(this, 'angle');
                        // Check hole/bounds
                        if (this.checkFailure(targetX, targetY, grid)) {
                            this.scene.tweens.add({
                                targets: this,
                                scaleX: 0,
                                scaleY: 0,
                                rotation: Math.PI,
                                duration: 500,
                                onComplete: () => {
                                    this.failed = true;
                                    resolve();
                                }
                            });
                        } else {
                            this.scene.time.delayedCall(200, resolve);
                        }
                    }
                });
            } else if (cmd === 'LEFT') {
                this.facing = (this.facing + 3) % 4;
                this.scene.tweens.add({
                    targets: this,
                    scaleY: 0.8,
                    scaleX: 1.2,
                    duration: 150,
                    yoyo: true,
                    onComplete: () => {
                        if (this.facing === 3) this.setFlipX(true);
                        else if (this.facing === 1) this.setFlipX(false);
                        this.scene.time.delayedCall(200, resolve);
                    }
                });
            } else if (cmd === 'RIGHT') {
                this.facing = (this.facing + 1) % 4;
                this.scene.tweens.add({
                    targets: this,
                    scaleY: 0.8,
                    scaleX: 1.2,
                    duration: 150,
                    yoyo: true,
                    onComplete: () => {
                        if (this.facing === 3) this.setFlipX(true);
                        else if (this.facing === 1) this.setFlipX(false);
                        this.scene.time.delayedCall(200, resolve);
                    }
                });
            } else if (cmd === 'JUMP') {
                // Procedural jump squash
                this.scene.tweens.add({
                    targets: this,
                    scaleX: this.baseScale * 0.8,
                    scaleY: this.baseScale * 1.2,
                    duration: 150,
                    yoyo: true
                });
                
                let dx = 0, dy = 0;
                if (this.facing === 0) dy = -this.gridSize * 2;
                if (this.facing === 1) dx = this.gridSize * 2;
                if (this.facing === 2) dy = this.gridSize * 2;
                if (this.facing === 3) dx = -this.gridSize * 2;
                
                const targetX = this.x + dx;
                const targetY = this.y + dy;

                const jumpTween = this.scene.tweens.add({
                    targets: this,
                    x: targetX,
                    y: targetY,
                    duration: 600,
                    ease: 'Linear',
                    onComplete: () => {
                        this.scene.cameras.main.shake(100, 0.005);
                        
                        // Check hole/bounds
                        if (this.checkFailure(targetX, targetY, grid)) {
                            this.scene.tweens.add({
                                targets: this,
                                scaleX: 0,
                                scaleY: 0,
                                rotation: Math.PI,
                                duration: 500,
                                onComplete: () => {
                                    this.failed = true;
                                    resolve();
                                }
                            });
                        } else {
                            this.scene.time.delayedCall(200, resolve);
                        }
                    }
                });

                this.scene.tweens.add({
                    targets: this,
                    y: this.y - 80, // Peak of jump
                    duration: 300,
                    yoyo: true,
                    ease: 'Sine.easeOut'
                });
            } else {
                resolve();
            }
        });
    }

    celebrate() {
        this.play('jump');
        this.scene.tweens.add({
            targets: this,
            y: this.y - 40,
            duration: 300,
            yoyo: true,
            repeat: 2,
            ease: 'Quad.easeOut'
        });
    }

    checkFailure(x, y, grid) {
        const gridX = Math.round((x - this.scene.gridStartX) / this.gridSize);
        const gridY = Math.round((y - this.gridSize / 2 - this.scene.gridStartY) / this.gridSize);

        if (gridX < 0 || gridX >= grid.gridWidth || gridY < 0 || gridY >= grid.gridHeight) {
            return true;
        }

        if (grid.holes && grid.holes.find(h => h.x === gridX && h.y === gridY)) {
            return true;
        }

        return false;
    }
}
