/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    const previouslyFocusedElement = document.activeElement;

    // Create the overlay element first, so it can be referenced
    const overlay = document.createElement('div');

    // Hide background content from screen readers
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
        // The script tag for main.js will also be a child, so we exclude it.
        if (child !== overlay && child.tagName !== 'SCRIPT' && !child.hasAttribute('aria-hidden')) {
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

    // Create the message box
    const messageBox = document.createElement('div');
    messageBox.style.position = 'relative'; // For positioning the close button
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px 40px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.maxWidth = '500px';
    messageBox.style.textAlign = 'center';
    messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    messageBox.setAttribute('role', 'alertdialog');
    messageBox.setAttribute('aria-modal', 'true');
    messageBox.setAttribute('aria-labelledby', 'error-title');

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
    closeButton.innerHTML = '&times;'; // A simple 'X'
    closeButton.setAttribute('aria-label', 'Close');
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '10px',
        right: '15px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#aaa',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    });

    closeButton.addEventListener('mouseenter', () => closeButton.style.color = '#333');
    closeButton.addEventListener('mouseleave', () => closeButton.style.color = '#aaa');

    // --- Close Functionality ---
    const close = () => {
        // Restore accessibility for background content
        bodyChildren.forEach(child => {
            if (child.getAttribute('aria-hidden') === 'true') {
                child.removeAttribute('aria-hidden');
            }
        });

        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);

        // Restore focus
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            close();
        }
    };

    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', handleKeyDown);


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
