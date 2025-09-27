const GameState = {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED'
};

class TimeManager {
    constructor() {
        if (TimeManager.instance) {
            return TimeManager.instance;
        }
        this.state = GameState.STOPPED;
        this.lastTime = 0;
        this.deltaTime = 0;
        TimeManager.instance = this;
    }

    /**
     * Updates the delta time. Should be called at the start of each frame.
     * @param {number} time - The current time from performance.now().
     */
    update(time) {
        if (this.state !== GameState.PLAYING) {
            this.deltaTime = 0;
        } else {
            this.deltaTime = (time - (this.lastTime || time)) * 0.001;
        }
        this.lastTime = time;
    }

    play() {
        if (this.state !== GameState.PLAYING) {
            this.state = GameState.PLAYING;
            console.log("TimeManager: State changed to PLAYING.");
        }
    }

    pause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            console.log("TimeManager: State changed to PAUSED.");
        }
    }

    togglePause() {
        if (this.state === GameState.PLAYING) {
            this.pause();
        } else if (this.state === GameState.PAUSED) {
            this.play();
        }
    }

    stop() {
        this.state = GameState.STOPPED;
        console.log("TimeManager: State changed to STOPPED.");
    }

    isPlaying() {
        return this.state === GameState.PLAYING;
    }
}

const timeManager = new TimeManager();
export default timeManager;