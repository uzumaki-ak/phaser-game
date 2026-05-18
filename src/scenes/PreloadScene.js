import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        const { width, height } = this.scale;
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 25);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFD93D, 1);
            progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 15);
        });

        // Load our high-quality generated assets
        this.load.image('bg_raw', '/assets/images/background.png');
        this.load.image('robot_raw', '/assets/images/robot_raw.png');
        this.load.image('blocks_raw', '/assets/images/blocks_raw.png');

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            
            // Process the raw images to remove white backgrounds and create proper sprites
            this.processAssets();
            
            this.scene.start('MenuScene');
        });
    }

    processAssets() {
        // We will make the white backgrounds transparent for the robot and blocks
        this.createTransparentTexture('robot_raw', 'robot_sprite', 230); // 230 is color threshold for "white"
        this.createTransparentTexture('blocks_raw', 'blocks_sprite', 230);
        
        // Background is already good, just alias it
        const bgImg = this.textures.get('bg_raw').getSourceImage();
        this.textures.addImage('background', bgImg);

        // Generate dynamic Star and Tile for the grid to keep it sharp
        this.generateVectorAssets();
    }

    createTransparentTexture(sourceKey, destKey, whiteThreshold) {
        const sourceImage = this.textures.get(sourceKey).getSourceImage();
        const canvas = document.createElement('canvas');
        canvas.width = sourceImage.width;
        canvas.height = sourceImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(sourceImage, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // If pixel is close to white, make it transparent
            if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
                // Smooth alpha blending at the edges instead of hard cutout
                const maxVal = Math.max(r, g, b);
                const alpha = Math.max(0, 255 - (maxVal - whiteThreshold) * (255 / (255 - whiteThreshold)));
                data[i + 3] = alpha;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        
        // Add to TextureManager
        this.textures.addSpriteSheet(destKey, canvas, { 
            frameWidth: canvas.width, 
            frameHeight: canvas.height 
        });
    }

    generateVectorAssets() {
        // --- Generate Goal Star ---
        const starCanvas = document.createElement('canvas');
        starCanvas.width = 64; starCanvas.height = 64;
        const sCtx = starCanvas.getContext('2d');
        sCtx.translate(32, 32);
        for(let i=0; i<5; i++) {
            sCtx.fillStyle = '#FFD93D';
            sCtx.beginPath();
            sCtx.moveTo(0, -24); sCtx.lineTo(6, -8); sCtx.lineTo(24, -6);
            sCtx.lineTo(10, 4); sCtx.lineTo(14, 22); sCtx.lineTo(0, 12);
            sCtx.lineTo(-14, 22); sCtx.lineTo(-10, 4); sCtx.lineTo(-24, -6);
            sCtx.lineTo(-6, -8); sCtx.fill();
            sCtx.fillStyle = '#FFF8E7'; 
            sCtx.beginPath(); sCtx.moveTo(0, -20); sCtx.lineTo(4, -8); sCtx.lineTo(0, -4); sCtx.lineTo(-4, -8); sCtx.fill();
            sCtx.rotate((Math.PI * 2) / 5);
        }
        this.textures.addSpriteSheet('star', starCanvas, { frameWidth: 64, frameHeight: 64 });

        // --- Generate Grid Tile ---
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = 80; tileCanvas.height = 80;
        const tCtx = tileCanvas.getContext('2d');
        tCtx.fillStyle = '#95E1A3';
        tCtx.beginPath(); tCtx.roundRect(4, 4, 72, 72, 12); tCtx.fill();
        tCtx.fillStyle = '#7AC788';
        tCtx.beginPath(); tCtx.roundRect(4, 68, 72, 8, {bl: 12, br: 12}); tCtx.fill();
        tCtx.fillStyle = '#B4EAC0';
        tCtx.beginPath(); tCtx.roundRect(8, 8, 64, 8, 6); tCtx.fill();
        this.textures.addSpriteSheet('tile', tileCanvas, { frameWidth: 80, frameHeight: 80 });
        
        // --- Generate Particles ---
        const g = this.add.graphics();
        g.fillStyle(0xFFFFFF, 1); g.fillCircle(4, 4, 4);
        g.generateTexture('particle', 8, 8);
        g.clear();
        g.fillStyle(0xFFD93D, 1); g.fillCircle(6, 6, 6);
        g.generateTexture('sparkle', 12, 12);
        g.destroy();
    }
}
