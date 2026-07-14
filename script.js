// ===== Typing effect with cursor =====
const texts = ["Video Editor", "Film Editor", "Creative Video Editor"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
const typedEl = document.getElementById("typed-text");
const cursorEl = document.getElementById("typed-cursor");
let isDeleting = false;

function type() {
    if (count >= texts.length) count = 0;
    currentText = texts[count];
    
    if (!isDeleting) {
        letter = currentText.slice(0, ++index);
        typedEl.textContent = letter;
        
        if (letter.length === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
    } else {
        letter = currentText.slice(0, --index);
        typedEl.textContent = letter;
        
        if (letter.length === 0) {
            isDeleting = false;
            count++;
            setTimeout(type, 500);
            return;
        }
    }
    
    setTimeout(type, isDeleting ? 50 : 150);
}

// Start typing
type();

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuIcon = document.getElementById('menuIcon');
const sidebarLinks = sidebar.querySelectorAll('a');

function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    menuIcon.textContent = sidebar.classList.contains('active') ? 'close' : 'menu';
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
sidebarLinks.forEach(link => link.addEventListener('click', () => { if (sidebar.classList.contains('active')) toggleMenu(); }));

// ===== Hero Slider with Video (با صدا) =====
const track = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.slider-dot');
const slides = track.querySelectorAll('.hero-slide');
let sl = 0, slTimer;
let isVideoPlaying = false;

function goSlide(n) {
    // Pause all videos before switching
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.classList.remove('controls-visible');
        }
        const btn = slide.querySelector('.video-play-btn');
        if (btn) {
            btn.classList.remove('hidden');
            btn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    isVideoPlaying = false;
    
    sl = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${sl * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === sl));
}

function autoSlide() {
    if (!isVideoPlaying) {
        slTimer = setInterval(() => goSlide(sl + 1), 4500);
    }
}

function resetAuto() {
    clearInterval(slTimer);
    if (!isVideoPlaying) autoSlide();
}

// Video play/pause for each slide
slides.forEach((slide, idx) => {
    const video = slide.querySelector('video');
    const playBtn = slide.querySelector('.video-play-btn');
    const volumeIndicator = slide.querySelector('.volume-indicator');
    
    if (video && playBtn) {
        // Click on play button
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                // Pause all other videos
                slides.forEach(s => {
                    const v = s.querySelector('video');
                    const b = s.querySelector('.video-play-btn');
                    if (v && v !== video) {
                        v.pause();
                        v.classList.remove('controls-visible');
                        if (b) {
                            b.classList.remove('hidden');
                            b.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    }
                });
                
                video.play();
                video.classList.add('controls-visible');
                playBtn.classList.add('hidden');
                isVideoPlaying = true;
                clearInterval(slTimer);
                
                // Show volume indicator with sound
                if (volumeIndicator) {
                    volumeIndicator.classList.add('visible');
                    volumeIndicator.innerHTML = '<i class="fas fa-volume-up"></i><span>🔊</span>';
                }
                
                // When video ends, resume autoplay
                video.onended = () => {
                    playBtn.classList.remove('hidden');
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    video.classList.remove('controls-visible');
                    isVideoPlaying = false;
                    if (volumeIndicator) {
                        volumeIndicator.classList.remove('visible');
                    }
                    autoSlide();
                };
            } else {
                video.pause();
                video.classList.remove('controls-visible');
                playBtn.classList.remove('hidden');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                isVideoPlaying = false;
                if (volumeIndicator) {
                    volumeIndicator.classList.remove('visible');
                }
                autoSlide();
            }
        });
        
        // Click on video to toggle
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                video.classList.add('controls-visible');
                playBtn.classList.add('hidden');
                isVideoPlaying = true;
                clearInterval(slTimer);
                if (volumeIndicator) {
                    volumeIndicator.classList.add('visible');
                    volumeIndicator.innerHTML = '<i class="fas fa-volume-up"></i><span>🔊</span>';
                }
                video.onended = () => {
                    playBtn.classList.remove('hidden');
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    video.classList.remove('controls-visible');
                    isVideoPlaying = false;
                    if (volumeIndicator) {
                        volumeIndicator.classList.remove('visible');
                    }
                    autoSlide();
                };
            } else {
                video.pause();
                video.classList.remove('controls-visible');
                playBtn.classList.remove('hidden');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                isVideoPlaying = false;
                if (volumeIndicator) {
                    volumeIndicator.classList.remove('visible');
                }
                autoSlide();
            }
        });
        
        // Click on volume indicator to mute/unmute
        if (volumeIndicator) {
            volumeIndicator.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                if (video.muted) {
                    volumeIndicator.innerHTML = '<i class="fas fa-volume-mute"></i><span>🔇</span>';
                } else {
                    volumeIndicator.innerHTML = '<i class="fas fa-volume-up"></i><span>🔊</span>';
                }
            });
        }
    }
});

// Navigation controls
document.getElementById('slNext').addEventListener('click', () => { goSlide(sl + 1); resetAuto(); });
document.getElementById('slPrev').addEventListener('click', () => { goSlide(sl - 1); resetAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { goSlide(i); resetAuto(); }));

// Touch support
let tsx = 0;
track.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
    const dx = tsx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { goSlide(dx > 0 ? sl + 1 : sl - 1); resetAuto(); }
});

autoSlide();

// ===== Intersection Observer =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right, .animate-fade-scale').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
});

document.querySelectorAll('.home .animate-slide-left, .home .animate-fade-up, .home .animate-fade-scale').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
});
