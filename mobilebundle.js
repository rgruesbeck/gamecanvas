// Mobile fixes

// prevent scroll/refresh
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false }) 