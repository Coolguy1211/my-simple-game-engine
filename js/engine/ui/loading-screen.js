let overlay;
export function showLoadingScreen() {
    if (!overlay) {
        overlay = document.body.appendChild(Object.assign(document.createElement('div'), {
            id: 'loading-overlay',
            innerHTML: '<div class="spinner"></div><div>Loading Scene...</div>',
            style: 'position:fixed;top:0;left:0;width:100%;height:100%;background:#101010;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:2000;font-family:sans-serif;color:#fff;transition:opacity 0.5s'
        }));
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-label', 'Loading scene');
        const s = document.head.appendChild(document.createElement('style'));
        s.textContent = '.spinner{width:36px;height:36px;border:4px solid #fff2;border-left-color:#0af;border-radius:50%;animation:s 1s linear infinite;margin-bottom:15px}@keyframes s{to{transform:rotate(360deg)}}';
    }
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 10);
}
export function hideLoadingScreen() {
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { if(overlay.style.opacity === '0') overlay.style.display = 'none'; }, 500);
    }
}
