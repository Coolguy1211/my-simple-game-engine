/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    // --- Focus Management ---
    const previouslyFocusedElement = document.activeElement;

    // --- ARIA for screen readers ---
    // Hide background content from screen readers
    const contentToHide = Array.from(document.body.children).filter(
        (child) => child.tagName !== 'SCRIPT' && child.tagName !== 'LINK'
    );
    contentToHide.forEach((child) => child.setAttribute('aria-hidden', 'true'));

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.fontFamily = 'sans-serif';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'error-title');

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // Create the title element
    const titleElement = document.createElement('h2');
    titleElement.id = 'error-title';
    titleElement.textContent = title;
    titleElement.style.color = '#d9534f'; // A reddish color for errors
    titleElement.style.marginBottom = '10px';

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = '#333';
    messageElement.style.lineHeight = '1.5';

    // --- Close Functionality ---
    const closeDialog = () => {
        // --- ARIA for screen readers ---
        // Restore background content visibility for screen readers
        contentToHide.forEach((child) => child.removeAttribute('aria-hidden'));

        document.removeEventListener('keydown', handleKeyDown);
        if (overlay.parentNode) {
            document.body.removeChild(overlay);
        }
        // --- Focus Management ---
        previouslyFocusedElement?.focus();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeDialog();
        }
    };

    // --- Close Button ---
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // Simple "X"
    closeButton.setAttribute('aria-label', 'Close error dialog');
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '8px',
        right: '12px',
        background: 'transparent',
        border: 'none',
        fontSize: '2rem',
        color: '#666',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1',
    });
    closeButton.addEventListener('click', closeDialog);

    // Add hover effect for better UX
    closeButton.addEventListener('mouseenter', () => closeButton.style.color = '#333');
    closeButton.addEventListener('mouseleave', () => closeButton.style.color = '#666');

    // Make message box relative for button positioning
    messageBox.style.position = 'relative';

    // Add listeners
    document.addEventListener('keydown', handleKeyDown);

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // --- Focus Management ---
    // Set focus to the close button after the dialog is rendered
    closeButton.focus();
}
