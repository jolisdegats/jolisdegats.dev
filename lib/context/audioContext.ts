class AudioContextManager {
    private audioContext: AudioContext | null = null;
    private isUnlocked = false;
    private pendingPromises: Array<() => void> = [];
    private unlockAttempted = false;
  
    constructor() {
      if (typeof window !== 'undefined') {
        this.setupAutoplayHandler();
      }
    }
  
    private setupAutoplayHandler() {
      const unlockAudio = () => {
        if (this.unlockAttempted) return;
        this.unlockAttempted = true;
  
        try {
          // Create a silent audio context to unlock audio
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Create a silent buffer and play it
          const buffer = this.audioContext.createBuffer(1, 1, 22050);
          const source = this.audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioContext.destination);
          source.start();
  
          this.isUnlocked = true;
          
          // Execute all pending promises
          this.pendingPromises.forEach(resolve => resolve());
          this.pendingPromises = [];
          
          // Remove event listeners
          document.removeEventListener('touchstart', unlockAudio);
          document.removeEventListener('touchend', unlockAudio);
          document.removeEventListener('mousedown', unlockAudio);
          document.removeEventListener('mouseup', unlockAudio);
          document.removeEventListener('click', unlockAudio);
        } catch (error) {
          console.warn('Audio context initialization failed:', error);
        }
      };
  
      // Add event listeners for various user interactions
      document.addEventListener('touchstart', unlockAudio);
      document.addEventListener('touchend', unlockAudio);
      document.addEventListener('mousedown', unlockAudio);
      document.addEventListener('mouseup', unlockAudio);
      document.addEventListener('click', unlockAudio);
    }
  
    public waitForUnlock(): Promise<void> {
      return new Promise((resolve) => {
        if (this.isUnlocked) {
          resolve();
        } else {
          this.pendingPromises.push(resolve);
        }
      });
    }
  
    public isAudioUnlocked(): boolean {
      return this.isUnlocked;
    }
  }
  
  export const audioContextManager = new AudioContextManager();