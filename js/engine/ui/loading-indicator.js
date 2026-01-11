// js/engine/ui/loading-indicator.js

let loadingOverlay = null;

/**
 * Displays a loading indicator overlay on the screen.
 */
export function showLoadingIndicator() {
    if (loadingOverlay) {
        return; // Already showing
    }

    // Create the overlay element
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.setAttribute('role', 'status');
    loadingOverlay.setAttribute('aria-live', 'polite');

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.className = 'loading-box';

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Loading...';

    // Assemble the elements
    messageBox.appendChild(messageElement);
    loadingOverlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(loadingOverlay);
}

/**
 * Hides the loading indicator overlay.
 */
export function hideLoadingIndicator() {
    if (loadingOverlay) {
        loadingOverlay.remove();
        loadingOverlay = null;
    }
}
