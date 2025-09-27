/**
 * A simple, global event bus for the engine.
 * This allows for decoupled communication between different systems and components.
 *
 * Usage:
 *
 * // System A: Emitting an event
 * import eventBus from './EventBus.js';
 * eventBus.emit('playerDied', { score: 100 });
 *
 * // System B: Listening for an event
 * import eventBus from './EventBus.js';
 *
 * class SomeComponent {
 *   constructor() {
 *     this.onPlayerDied = this.onPlayerDied.bind(this);
 *   }
 *
 *   onStart() {
 *     eventBus.on('playerDied', this.onPlayerDied);
 *   }
 *
 *   onDestroy() {
 *     eventBus.off('playerDied', this.onPlayerDied);
 *   }
 *
 *   onPlayerDied(data) {
 *     console.log(`Player died with score: ${data.score}`);
 *   }
 * }
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Register an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} callback - The function to call when the event is emitted.
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Remove an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} callback - The specific handler to remove.
     */
    off(event, callback) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter(
            (listener) => listener !== callback
        );
    }

    /**
     * Emit an event, calling all registered handlers.
     * @param {string} event - The name of the event to emit.
     * @param {*} [data] - Optional data to pass to the event handlers.
     */
    emit(event, data) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((callback) => callback(data));
    }
}

// Export a single instance to act as a global event bus
const eventBus = new EventBus();
export default eventBus;