/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    //
    // 🎨 PALETTE: Adding a dismissible modal with accessibility fixes.
    //
    const previousActiveElement = document.activeElement;

    // Create the overlay element
    const overlay = document.createElement('div');
    const directChildrenOfBody = Array.from(document.body.children);

    // Hide background content from screen readers
    directChildrenOfBody.forEach(child => {
        if (child !== overlay) {
            child.setAttribute('aria-hidden', 'true');
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

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    messageBox.style.position = 'relative'; // For positioning the close button

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

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '24px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.cursor = 'pointer';

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Focus management
    closeButton.focus();

    function close() {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
        directChildrenOfBody.forEach(child => {
            if (child.hasAttribute('aria-hidden')) {
                child.removeAttribute('aria-hidden');
            }
        });
        previousActiveElement.focus();
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            close();
        }
    }

    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', handleKeyDown);
}
