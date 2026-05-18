// Simple Web Audio API Synthesizer for game juice

class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
        this.isMusicPlaying = false;
    }

    playTone(freq, type, duration, vol = 1) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playPop() {
        this.playTone(600, 'sine', 0.1, 0.5);
        setTimeout(() => this.playTone(800, 'sine', 0.1, 0.5), 50);
    }

    playSnap() {
        this.playTone(1200, 'square', 0.05, 0.2);
    }

    playWin() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.5), i * 150);
        });
    }

    playLose() {
        const notes = [300, 250, 200];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sawtooth', 0.4, 0.3), i * 200);
        });
    }

    playBark() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        
        // Impulse 1 (Main bark sound)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
        
        // Impulse 2 (Quick secondary yip)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(700, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(350, now + 0.15);
        
        gain2.gain.setValueAtTime(0.3, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.15);
    }

    playWhimper() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.15);
        osc.frequency.linearRampToValueAtTime(800, now + 0.35);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    startBGM() {
        if (this.isMusicPlaying) return;
        this.isMusicPlaying = true;
        
        // Very simple ambient generative sequence
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00]; // Pentatonic C
        const playNext = () => {
            if (!this.isMusicPlaying) return;
            const note = scale[Math.floor(Math.random() * scale.length)];
            this.playTone(note, 'sine', 0.5, 0.1);
            setTimeout(playNext, 500); // Play a note every 500ms
        };
        playNext();
    }

    stopBGM() {
        this.isMusicPlaying = false;
    }
}

export const audio = new AudioManager();
