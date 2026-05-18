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
        // --- Generate Goal Puppy (Happy) ---
        const pupCanvas = document.createElement('canvas');
        pupCanvas.width = 64; pupCanvas.height = 64;
        const pCtx = pupCanvas.getContext('2d');
        
        // Draw body
        pCtx.fillStyle = '#C49A6C'; // Cream/brown color
        pCtx.beginPath();
        pCtx.arc(32, 40, 16, 0, Math.PI * 2); // Body
        pCtx.fill();
        
        // Draw head
        pCtx.fillStyle = '#D4A373'; // Head base color
        pCtx.beginPath();
        pCtx.arc(32, 28, 14, 0, Math.PI * 2); // Head
        pCtx.fill();
        
        // Draw ears (floppy)
        pCtx.fillStyle = '#A06E3F'; // Darker brown for ears
        // Left ear
        pCtx.beginPath();
        pCtx.ellipse(18, 28, 5, 12, Math.PI / 12, 0, Math.PI * 2);
        pCtx.fill();
        // Right ear
        pCtx.beginPath();
        pCtx.ellipse(46, 28, 5, 12, -Math.PI / 12, 0, Math.PI * 2);
        pCtx.fill();
        
        // Draw muzzle (snout)
        pCtx.fillStyle = '#FFF8E7';
        pCtx.beginPath();
        pCtx.arc(32, 33, 5, 0, Math.PI * 2);
        pCtx.fill();
        
        // Draw nose
        pCtx.fillStyle = '#333333';
        pCtx.beginPath();
        pCtx.arc(32, 31, 2.5, 0, Math.PI * 2);
        pCtx.fill();
        
        // Draw eyes
        pCtx.fillStyle = '#111111';
        pCtx.beginPath();
        pCtx.arc(26, 25, 2, 0, Math.PI * 2); // Left eye
        pCtx.arc(38, 25, 2, 0, Math.PI * 2); // Right eye
        pCtx.fill();
        
        // Eye reflections
        pCtx.fillStyle = '#FFFFFF';
        pCtx.beginPath();
        pCtx.arc(25.5, 24.5, 0.7, 0, Math.PI * 2);
        pCtx.arc(37.5, 24.5, 0.7, 0, Math.PI * 2);
        pCtx.fill();
        
        // Little happy tongue
        pCtx.fillStyle = '#FF8FAB';
        pCtx.beginPath();
        pCtx.arc(32, 35.5, 2, 0, Math.PI);
        pCtx.fill();

        this.textures.addSpriteSheet('puppy_happy', pupCanvas, { frameWidth: 64, frameHeight: 64 });

        // --- Generate Goal Puppy (Sad) ---
        const pupSadCanvas = document.createElement('canvas');
        pupSadCanvas.width = 64; pupSadCanvas.height = 64;
        const psCtx = pupSadCanvas.getContext('2d');
        
        // Draw body
        psCtx.fillStyle = '#C49A6C';
        psCtx.beginPath();
        psCtx.arc(32, 40, 16, 0, Math.PI * 2);
        psCtx.fill();
        
        // Draw head
        psCtx.fillStyle = '#D4A373';
        psCtx.beginPath();
        psCtx.arc(32, 30, 14, 0, Math.PI * 2); // Head slightly lower
        psCtx.fill();
        
        // Draw ears (droopy/longer)
        psCtx.fillStyle = '#A06E3F';
        // Left ear droops down more vertically
        psCtx.beginPath();
        psCtx.ellipse(17, 34, 5, 14, 0, 0, Math.PI * 2);
        psCtx.fill();
        // Right ear
        psCtx.beginPath();
        psCtx.ellipse(47, 34, 5, 14, 0, 0, Math.PI * 2);
        psCtx.fill();
        
        // Draw muzzle
        psCtx.fillStyle = '#FFF8E7';
        psCtx.beginPath();
        psCtx.arc(32, 35, 5, 0, Math.PI * 2);
        psCtx.fill();
        
        // Draw nose
        psCtx.fillStyle = '#333333';
        psCtx.beginPath();
        psCtx.arc(32, 33, 2.5, 0, Math.PI * 2);
        psCtx.fill();
        
        // Draw sad eyes
        psCtx.fillStyle = '#111111';
        psCtx.beginPath();
        psCtx.arc(26, 27, 2, 0, Math.PI * 2); // Left eye
        psCtx.arc(38, 27, 2, 0, Math.PI * 2); // Right eye
        psCtx.fill();
        
        // Worried/sad eyebrows
        psCtx.strokeStyle = '#A06E3F';
        psCtx.lineWidth = 1.5;
        psCtx.beginPath();
        psCtx.moveTo(23, 23); psCtx.lineTo(28, 25); // Left eyebrow (slanted up-middle)
        psCtx.moveTo(41, 23); psCtx.lineTo(36, 25); // Right eyebrow (slanted up-middle)
        psCtx.stroke();

        this.textures.addSpriteSheet('puppy_sad', pupSadCanvas, { frameWidth: 64, frameHeight: 64 });

        // --- Generate Heart Particle ---
        const heartCanvas = document.createElement('canvas');
        heartCanvas.width = 16; heartCanvas.height = 16;
        const hCtx = heartCanvas.getContext('2d');
        hCtx.fillStyle = '#FF8FAB'; // Candy Pink
        hCtx.beginPath();
        hCtx.moveTo(8, 4);
        hCtx.bezierCurveTo(8, 1, 3, 1, 3, 4);
        hCtx.bezierCurveTo(3, 8, 8, 11, 8, 14);
        hCtx.bezierCurveTo(8, 11, 13, 8, 13, 4);
        hCtx.bezierCurveTo(13, 1, 8, 1, 8, 4);
        hCtx.fill();
        this.textures.addSpriteSheet('heart', heartCanvas, { frameWidth: 16, frameHeight: 16 });

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
