/**
 * Displays an error message overlay on the screen with accessibility enhancements.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previousActiveElement = document.activeElement;
    const backgroundElements = [];

    // Hide background content for screen readers
    Array.from(document.body.children).forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'LINK') {
            if (child.getAttribute('aria-hidden') !== 'true') {
                child.setAttribute('aria-hidden', 'true');
                backgroundElements.push(child);
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
    messageBox.setAttribute('role', 'dialog');
    messageBox.setAttribute('aria-modal', 'true');
    messageBox.setAttribute('aria-labelledby', 'error-title');
    messageBox.style.position = 'relative';
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // Create the title element
    const titleElement = document.createElement('h2');
    titleElement.id = 'error-title';
    titleElement.textContent = title;
    titleElement.style.color = '#d9534f';
    titleElement.style.marginBottom = '10px';
    titleElement.style.marginTop = '0';

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = '#333';
    messageElement.style.lineHeight = '1.5';
    messageElement.style.marginBottom = '20px';

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
    closeButton.style.padding = '5px';
    closeButton.style.lineHeight = '1';

    // Function to close the dialog
    const closeModal = () => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        backgroundElements.forEach(el => el.removeAttribute('aria-hidden'));
        previousActiveElement?.focus();
        document.removeEventListener('keydown', handleKeyDown);
    };

    closeButton.onclick = closeModal;

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Focus management
    closeButton.focus();

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = messageBox.querySelectorAll(focusableElements)[0];
    const focusableContent = messageBox.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);
}
