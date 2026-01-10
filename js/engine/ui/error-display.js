/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previousActiveElement = document.activeElement;
    const directChildrenOfBody = Array.from(document.body.children);

    // Hide background content for screen readers
    directChildrenOfBody.forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'LINK' && child.style.display !== 'none') {
            child.setAttribute('aria-hidden', 'true');
        }
    });

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

    const messageBox = document.createElement('div');
    messageBox.setAttribute('role', 'alertdialog');
    messageBox.setAttribute('aria-modal', 'true');
    messageBox.setAttribute('aria-labelledby', 'error-title');
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    messageBox.style.position = 'relative';

    const titleElement = document.createElement('h2');
    titleElement.id = 'error-title';
    titleElement.textContent = title;
    titleElement.style.color = '#d9534f';
    titleElement.style.marginBottom = '10px';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = '#333';
    messageElement.style.lineHeight = '1.5';
    messageElement.style.marginBottom = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.lineHeight = '1';

    function closeModal() {
        document.body.removeChild(overlay);
        // Restore screen reader visibility
        directChildrenOfBody.forEach(child => {
            if (child.hasAttribute('aria-hidden')) {
                child.removeAttribute('aria-hidden');
            }
        });
        document.removeEventListener('keydown', handleKeyDown);
        previousActiveElement?.focus();
    }

    closeButton.onclick = closeModal;

    messageBox.appendChild(closeButton);
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    closeButton.focus();

    // Focus trap
    const focusableElements = [closeButton];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
            return;
        }

        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    }

    document.addEventListener('keydown', handleKeyDown);
}
