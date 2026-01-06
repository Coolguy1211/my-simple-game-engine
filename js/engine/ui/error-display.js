/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previouslyFocusedElement = document.activeElement;

    // Create the overlay element
    const overlay = document.createElement('div');

    // Hide background content from screen readers
    const backgroundContent = Array.from(document.body.children).filter(el => el !== overlay);
    backgroundContent.forEach(el => {
        if (el.hasAttribute('aria-hidden')) {
            el.dataset.wasHidden = 'true';
        } else {
            el.setAttribute('aria-hidden', 'true');
        }
    });

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

    // --- Close Modal Logic ---
    function closeModal() {
        // Restore background content visibility for screen readers
        backgroundContent.forEach(el => {
            if (el.dataset.wasHidden === 'true') {
                el.removeAttribute('data-was-hidden');
            } else {
                el.removeAttribute('aria-hidden');
            }
        });

        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        document.removeEventListener('keydown', handleKeyDown);

        // Restore focus to the previously focused element
        previouslyFocusedElement?.focus();
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    document.addEventListener('keydown', handleKeyDown);


    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.style.position = 'relative';
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // --- Close Button ---
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0';
    closeButton.style.lineHeight = '1';
    closeButton.onclick = closeModal;
    messageBox.appendChild(closeButton);

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
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Set focus on the close button
    closeButton.focus();
}
