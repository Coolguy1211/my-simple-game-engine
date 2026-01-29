const LOADING_INDICATOR_ID = 'loading-indicator-overlay';
const STYLE_ID = 'loading-indicator-style';

function createSpinnerStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = STYLE_ID;
    styleElement.textContent = `
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    return styleElement;
}

export function showLoadingIndicator() {
    if (document.getElementById(LOADING_INDICATOR_ID)) {
        return;
    }

    // Add styles to the head
    document.head.appendChild(createSpinnerStyles());

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = LOADING_INDICATOR_ID;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1001';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-label', 'Loading scene');

    // Create the spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    // Assemble and append to body
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
}

export function hideLoadingIndicator() {
    const overlay = document.getElementById(LOADING_INDICATOR_ID);
    if (overlay) {
        overlay.remove();
    }

    const styleElement = document.getElementById(STYLE_ID);
    if (styleElement) {
        styleElement.remove();
    }
}
