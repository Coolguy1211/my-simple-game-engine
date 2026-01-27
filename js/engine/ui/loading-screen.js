const LOADING_SCREEN_ID = 'loading-screen-overlay';

/**
 * Displays a loading screen overlay by creating the necessary DOM elements
 * and assigning them an ID that is styled by an external CSS file.
 */
export function showLoadingScreen() {
    // If a loading screen is already present, do nothing.
    if (document.getElementById(LOADING_SCREEN_ID)) {
        return;
    }

    // Create the overlay element and assign it the ID for styling.
    const overlay = document.createElement('div');
    overlay.id = LOADING_SCREEN_ID;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'assertive');

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Loading...';

    // Assemble the elements
    overlay.appendChild(messageElement);

    // Add to the body
    document.body.appendChild(overlay);
}

/**
 * Hides the loading screen overlay.
 */
export function hideLoadingScreen() {
    const overlay = document.getElementById(LOADING_SCREEN_ID);
    if (overlay) {
        overlay.remove();
    }
}
