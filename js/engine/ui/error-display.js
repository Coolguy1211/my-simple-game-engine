/**
 * Displays an error message overlay on the screen.
 * @param {string} title - The title of the error message.
 * @param {string} message - The main content of the error message.
 */
export function displayError(title, message) {
    // Create the overlay element
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    });
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'error-title');

    // Create the message box
    const messageBox = document.createElement('div');
    Object.assign(messageBox.style, {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    });

    // Create the title element
    const titleElement = document.createElement('h2');
    titleElement.id = 'error-title';
    titleElement.textContent = title;
    titleElement.style.color = '#d9534f';
    titleElement.style.margin = '0 0 15px 0';

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = '#444';
    messageElement.style.lineHeight = '1.6';
    messageElement.style.margin = '0 0 25px 0';

    // Create the reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    Object.assign(reloadButton.style, {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        transition: 'background-color 0.2s'
    });
    reloadButton.onmouseover = () => reloadButton.style.backgroundColor = '#c9302c';
    reloadButton.onmouseout = () => reloadButton.style.backgroundColor = '#d9534f';
    reloadButton.onclick = () => window.location.reload();

    // Assemble the elements
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(reloadButton);
    overlay.appendChild(messageBox);

    // Add to the body
    document.body.appendChild(overlay);

    // Set focus to the reload button for accessibility
    reloadButton.focus();
}
