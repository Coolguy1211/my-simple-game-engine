/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previouslyFocusedElement = document.activeElement;

    // --- Hide background content ---
    const backgroundElements = [];
    Array.from(document.body.children).forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            // Check if it's already hidden, so we don't unhide it later
            if (child.getAttribute('aria-hidden') !== 'true') {
                 backgroundElements.push(child);
                 child.setAttribute('aria-hidden', 'true');
            }
        }
    });

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

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.position = 'relative';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    messageBox.setAttribute('role', 'dialog');
    messageBox.setAttribute('aria-modal', 'true');
    messageBox.setAttribute('aria-labelledby', 'error-title');

    // --- Close Button ---
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = '×';
    // Basic styling for the close button
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '2rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#888';
    closeButton.style.padding = '0';
    closeButton.style.lineHeight = '1';

    // --- Close Functionality ---
    const closeModal = () => {
        // --- Restore background content ---
        backgroundElements.forEach(element => {
            element.removeAttribute('aria-hidden');
        });

        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }

        // --- Focus Trap ---
        // Since the close button is the only focusable element, we prevent
        // the default tabbing behavior to keep focus within the modal.
        if (event.key === 'Tab') {
            event.preventDefault();
        }
    };

    closeButton.onclick = closeModal;

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

    // Add to the body
    document.body.appendChild(overlay);

    // Listen for Escape key
    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button by default
    closeButton.focus();
}
