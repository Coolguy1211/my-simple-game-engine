/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previouslyFocusedElement = document.activeElement;
    const bodyChildren = Array.from(document.body.children);

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
    messageBox.style.position = 'relative';
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '24px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#888';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

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

    // Assemble the elements
    messageBox.appendChild(closeButton);
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    overlay.appendChild(messageBox);

    // --- Accessibility & Cleanup ---
    function closeOverlay() {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
        bodyChildren.forEach(child => {
            if (child !== overlay) {
                child.removeAttribute('aria-hidden');
            }
        });
        previouslyFocusedElement?.focus();
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeOverlay();
        }
    }

    closeButton.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', handleKeyDown);

    // Hide background content from screen readers
    bodyChildren.forEach(child => {
        child.setAttribute('aria-hidden', 'true');
    });

    // Add to the body
    document.body.appendChild(overlay);

    // Set focus to the close button
    closeButton.focus();
}
