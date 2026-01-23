/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.className = 'error-overlay';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'error-title');

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.className = 'error-message-box';

    // Create the title element
    const titleElement = document.createElement('h2');
    titleElement.id = 'error-title';
    titleElement.className = 'error-title';
    titleElement.textContent = title;

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.className = 'error-message';
    messageElement.textContent = message;

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.className = 'error-close-button';
    closeButton.textContent = 'Close';

    const closeModal = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    // Add click listener to remove the overlay
    closeButton.addEventListener('click', closeModal);

    document.addEventListener('keydown', handleKeydown);

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Set focus on the close button for accessibility
    closeButton.focus();
}
