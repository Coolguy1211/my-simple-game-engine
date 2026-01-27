const LOADING_INDICATOR_ID = 'loading-indicator';

/**
 * Creates and shows a loading indicator overlay.
 */
export function showLoadingIndicator() {
    // If the indicator already exists, do nothing.
    if (document.getElementById(LOADING_INDICATOR_ID)) {
        return;
    }

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = LOADING_INDICATOR_ID;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '2000'; // Higher than error display
    overlay.style.color = '#fff';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.fontSize = '24px';

    // Accessibility attributes
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-label', 'Loading scene');

    // Add content to the overlay
    overlay.textContent = 'Loading...';

    // Append to the body
    document.body.appendChild(overlay);
}

/**
 * Hides the loading indicator overlay.
 */
export function hideLoadingIndicator() {
    const indicator = document.getElementById(LOADING_INDICATOR_ID);
    if (indicator) {
        indicator.remove();
    }
}
