document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on load/refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Dropdown menu click toggle
    const dropdownBtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.classList.contains('dropbtn')) return;
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // Hero Video Play/Pause
    const heroVideo = document.querySelector('.hero-video');
    const playBtn = document.querySelector('.hero-play-btn');

    if (heroVideo && playBtn) {
        playBtn.addEventListener('click', () => {
            if (heroVideo.paused) {
                heroVideo.play();
                playBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
                playBtn.setAttribute('aria-label', 'Pause Video');
            } else {
                heroVideo.pause();
                playBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
                playBtn.setAttribute('aria-label', 'Play Video');
            }
        });
    }



    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });



    // Dynamic Brand Marquee
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const marqueeItems = Array.from(marqueeContent.children);

        // Clone items to ensure seamless loop
        marqueeItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // Accessibility
            marqueeContent.appendChild(clone);
        });

        // Duplicate again if screen is wide to prevent gaps
        if (window.innerWidth > 1000) {
            marqueeItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                marqueeContent.appendChild(clone);
            });
        }
    }

    // Contact Form Handling with EmailJS
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state (optional: disable button)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // These IDs from the user:
            const serviceID = 'service_la6ukoc';
            const templateID = 'template_50jz918';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    alert('Message Sent Successfully!');
                    contactForm.reset();
                }, (err) => {
                    alert('Failed to send message. Please try again later.');
                    console.log(JSON.stringify(err));
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }


    // Number Counting Animation
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2500; // 2.5 seconds for smooth accumulation

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const start = +counter.innerText || 0;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / animationDuration, 1);

                // Easing function (optional, e.g., EaseOutQuart) for smoother effect
                // const ease = 1 - Math.pow(1 - progress, 4); 
                // Using Linear for "slow" consistent feel requested for dates

                const current = Math.floor(start + ((target - start) * progress));
                counter.innerText = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    // Trigger animation when stats section is in view
    let hasAnimated = false;
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, {
            threshold: 0.5
        });
        observer.observe(statsSection);
    }


    // Simple Carousel
    const carousel = document.querySelector('.simple-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const prevBtn = carousel.querySelector('.carousel-arrow.prev');
        const nextBtn = carousel.querySelector('.carousel-arrow.next');

        let currentSlide = 0;
        // Auto-play removed as per request

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(n) {
            dots[currentSlide].classList.remove('active');

            currentSlide = n;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;

            // Update transform to slide
            const slidesContainer = carousel.querySelector('.carousel-slides');
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
});
