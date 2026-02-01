export function showLoadingScreen() {
    let el = document.getElementById('loading-overlay');
    if (!el) {
        el = document.createElement('div');
        el.id = 'loading-overlay';
        Object.assign(el.style, { position: 'fixed', inset: '0', background: '#101010', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: '2000', transition: 'opacity 0.5s', color: '#fff', fontFamily: 'sans-serif' });
        el.innerHTML = '<div style="width:40px;height:40px;border:4px solid #fff2;border-top-color:#fff;border-radius:50%;animation:s 1s linear infinite;margin-bottom:20px"></div><span>Loading Scene...</span><style>@keyframes s{to{transform:rotate(360deg)}}</style>';
        document.body.appendChild(el);
    }
    el.style.display = 'flex';
    setTimeout(() => el.style.opacity = '1', 0);
}

export function hideLoadingScreen() {
    const el = document.getElementById('loading-overlay');
    if (el) {
        el.style.opacity = '0';
        setTimeout(() => { if (el.style.opacity === '0') el.style.display = 'none'; }, 500);
    }
}
