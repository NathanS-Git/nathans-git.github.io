const video = document.getElementById('automata-video');

// When video ends, fade to homepage
video.addEventListener('ended', function() {
    gsap.timeline()
        .to('#loading-screen', {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        })
        .to('#homepage', {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.5")
        .call(() => {
            document.getElementById('loading-screen').style.display = 'none';
        });
});

// Fallback: If video fails to load, skip to homepage after 3 seconds
video.addEventListener('error', function(e) {
    console.error('Video failed to load:', e);
    setTimeout(() => {
        gsap.timeline()
            .to('#loading-screen', { opacity: 0, duration: 1 })
            .to('#homepage', { opacity: 1, duration: 1 }, "-=0.5")
            .call(() => {
                document.getElementById('loading-screen').style.display = 'none';
            });
    }, 1000);
});
