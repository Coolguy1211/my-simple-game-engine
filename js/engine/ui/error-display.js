/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
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

    // Store the previously focused element to restore focus when the modal is closed
    const previouslyFocusedElement = document.activeElement;

    // Selectively hide background content from screen readers to avoid side effects.
    const elementsToHide = Array.from(document.body.children).filter(
        (child) => child.getAttribute('aria-hidden') !== 'true'
    );
    elementsToHide.forEach((child) => child.setAttribute('aria-hidden', 'true'));

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

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // A simple 'x' for the close icon
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333';

    // Function to handle keydown events for accessibility (e.g., Escape key)
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    // Function to close the modal
    function closeModal() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to the element that had it before the modal was opened
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
        // Restore visibility only to the elements that were explicitly hidden.
        elementsToHide.forEach((child) => child.removeAttribute('aria-hidden'));
    }

    closeButton.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeyDown);

    // Make the message box position relative to contain the close button
    messageBox.style.position = 'relative';

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Focus the close button for accessibility
    closeButton.focus();
}
