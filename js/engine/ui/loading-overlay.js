export function showLoadingOverlay() {
    if (document.getElementById('loading-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999,
        color: '#fff', fontFamily: 'sans-serif'
    });
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = `
        <div class="spinner"></div>
        <div style="font-size: 1.2rem;">Loading Scene...</div>
    `;
    if (!document.getElementById('loading-style')) {
        const style = document.createElement('style');
        style.id = 'loading-style';
        style.textContent = `
            .spinner { width: 40px; height: 40px; border: 4px solid #fff3; border-top: 4px solid #fff; border-radius: 50%; animation: loading-spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes loading-spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
}

export function hideLoadingOverlay() {
    document.getElementById('loading-overlay')?.remove();
}
