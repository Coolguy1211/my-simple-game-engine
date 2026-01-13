/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    // --- Focus Management ---
    const previouslyFocusedElement = document.activeElement;

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
    messageBox.style.position = 'relative'; // For positioning the close button
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#888';
    closeButton.setAttribute('aria-label', 'Close dialog');

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

    // --- Close Functionality ---
    const closeDialog = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to the previously focused element
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeDialog();
        }
    };

    closeButton.addEventListener('click', closeDialog);
    document.addEventListener('keydown', handleKeyDown);

    // Add to the body
    document.body.appendChild(overlay);

    // --- Post-Append Accessibility ---
    // Set focus on the close button after the dialog is in the DOM
    closeButton.focus();
}
