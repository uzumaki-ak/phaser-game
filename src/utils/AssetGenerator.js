// src/utils/AssetGenerator.js

export function generateAssets(scene) {
    const graphics = scene.make.graphics();

    // --- Generate Robot Sprite Sheet (Idle, Walk 1, Walk 2, Jump) ---
    // We will draw it onto a canvas and generate a texture.
    const robW = 64, robH = 80;
    const frames = 4;
    const canvas = document.createElement('canvas');
    canvas.width = robW * frames;
    canvas.height = robH;
    const ctx = canvas.getContext('2d');

    const drawRobot = (ctx, xOffset, frameIndex) => {
        ctx.save();
        ctx.translate(xOffset, 0);

        // Variables for animation
        let yBounce = frameIndex === 0 ? 2 : (frameIndex === 1 || frameIndex === 2 ? 0 : -4);
        let wheelRot = frameIndex === 1 ? Math.PI/4 : (frameIndex === 2 ? -Math.PI/4 : 0);
        let armRot = frameIndex === 1 ? -0.2 : (frameIndex === 2 ? 0.2 : (frameIndex === 3 ? -0.5 : 0));

        // Backpack jet
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.roundRect(10, 30 + yBounce, 16, 24, 4);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#333333';
        ctx.save();
        ctx.translate(22, 70 + yBounce);
        ctx.rotate(wheelRot);
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#666666';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#333333';
        ctx.save();
        ctx.translate(42, 70 + yBounce);
        ctx.rotate(wheelRot);
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#666666';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        // Body
        ctx.fillStyle = '#E5E7EB'; // Light gray
        ctx.beginPath();
        ctx.roundRect(16, 36 + yBounce, 32, 28, 6);
        ctx.fill();
        // Body shading
        ctx.fillStyle = '#D1D5DB';
        ctx.beginPath();
        ctx.roundRect(16, 54 + yBounce, 32, 10, {bl:6, br:6});
        ctx.fill();

        // Neck
        ctx.fillStyle = '#9CA3AF';
        ctx.fillRect(28, 28 + yBounce, 8, 8);

        // Head (Square)
        ctx.fillStyle = '#F3F4F6';
        ctx.beginPath();
        ctx.roundRect(12, 6 + yBounce, 40, 26, 6);
        ctx.fill();
        ctx.fillStyle = '#E5E7EB';
        ctx.beginPath();
        ctx.roundRect(12, 24 + yBounce, 40, 8, {bl:6, br:6});
        ctx.fill();

        // Eyes (Glowing Blue)
        ctx.shadowColor = '#60A5FA';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath(); ctx.roundRect(20, 14 + yBounce, 8, 8, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(36, 14 + yBounce, 8, 8, 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Antenna
        ctx.fillStyle = '#9CA3AF';
        ctx.fillRect(30, yBounce, 4, 6);
        ctx.fillStyle = '#EF4444'; // Red light
        ctx.beginPath(); ctx.arc(32, yBounce - 2, 4, 0, Math.PI*2); ctx.fill();

        // Arms
        ctx.fillStyle = '#D1D5DB';
        ctx.save();
        ctx.translate(16, 42 + yBounce);
        ctx.rotate(armRot);
        ctx.beginPath(); ctx.roundRect(-4, -4, 8, 20, 4); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(48, 42 + yBounce);
        ctx.rotate(-armRot);
        ctx.beginPath(); ctx.roundRect(-4, -4, 8, 20, 4); ctx.fill();
        ctx.restore();

        // If jump frame, draw jet exhaust
        if (frameIndex === 3) {
            ctx.fillStyle = '#FCD34D';
            ctx.beginPath();
            ctx.moveTo(14, 54 + yBounce);
            ctx.lineTo(22, 54 + yBounce);
            ctx.lineTo(18, 64 + yBounce);
            ctx.fill();
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.moveTo(16, 54 + yBounce);
            ctx.lineTo(20, 54 + yBounce);
            ctx.lineTo(18, 58 + yBounce);
            ctx.fill();
        }

        ctx.restore();
    };

    for(let i=0; i<frames; i++) {
        drawRobot(ctx, i * robW, i);
    }
    scene.textures.addSpriteSheet('robot', canvas, { frameWidth: robW, frameHeight: robH });


    // --- Generate Goal Star ---
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64; starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d');
    sCtx.translate(32, 32);
    for(let i=0; i<5; i++) {
        sCtx.fillStyle = '#FFD93D';
        sCtx.beginPath();
        sCtx.moveTo(0, -24);
        sCtx.lineTo(6, -8);
        sCtx.lineTo(24, -6);
        sCtx.lineTo(10, 4);
        sCtx.lineTo(14, 22);
        sCtx.lineTo(0, 12);
        sCtx.lineTo(-14, 22);
        sCtx.lineTo(-10, 4);
        sCtx.lineTo(-24, -6);
        sCtx.lineTo(-6, -8);
        sCtx.fill();
        sCtx.fillStyle = '#FFF8E7'; // Highlight
        sCtx.beginPath();
        sCtx.moveTo(0, -20);
        sCtx.lineTo(4, -8);
        sCtx.lineTo(0, -4);
        sCtx.lineTo(-4, -8);
        sCtx.fill();
        sCtx.rotate((Math.PI * 2) / 5);
    }
    scene.textures.addSpriteSheet('star', starCanvas, { frameWidth: 64, frameHeight: 64 });

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
    scene.textures.addSpriteSheet('tile', tileCanvas, { frameWidth: 80, frameHeight: 80 });

    // --- Generate Cloud ---
    graphics.clear();
    graphics.fillStyle(0xFFFFFF, 0.8);
    graphics.fillCircle(40, 40, 30);
    graphics.fillCircle(80, 30, 40);
    graphics.fillCircle(120, 40, 30);
    graphics.fillRoundedRect(30, 30, 100, 40, 20);
    graphics.generateTexture('cloud', 160, 80);

    // --- Generate Particles ---
    graphics.clear();
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);

    graphics.clear();
    graphics.fillStyle(0xFFD93D, 1); // Yellow spark
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture('sparkle', 12, 12);
}
