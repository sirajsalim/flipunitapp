/**
 * Flip Unit Landing Page - JavaScript
 * Handles interactivity while respecting accessibility preferences
 */

(function() {
    'use strict';

    // ==========================================================================
    // Global State
    // ==========================================================================

    let currentTheme = 'dark';
    let currentHeroIndex = 1;
    const totalScreenshots = 6;

    // Screenshot alt texts for accessibility
    const screenshotAlts = {
        1: 'Flip Unit app home screen showing six conversion categories: Cooking, Currency, Area, Distance, Temperature, and Weight',
        2: 'Currency conversion screen showing 25 British Pounds converting to 33.60 US Dollars',
        3: 'Unit picker showing organized metric and imperial sections',
        4: 'Cooking conversion with ingredient-specific options',
        5: 'Conversion history showing recent conversions',
        6: 'Settings screen with theme and history options'
    };

    // ==========================================================================
    // Hero Screenshot Navigation
    // ==========================================================================

    const heroScreenshot = document.querySelector('.hero-screenshot');
    const heroPrevBtn = document.querySelector('.hero-nav-prev');
    const heroNextBtn = document.querySelector('.hero-nav-next');
    const heroCurrentSpan = document.querySelector('.hero-current');

    function updateHeroScreenshot() {
        if (!heroScreenshot) return;

        const newSrc = heroScreenshot.dataset[`${currentTheme}${currentHeroIndex}`];
        if (newSrc) {
            heroScreenshot.src = newSrc;
            heroScreenshot.alt = screenshotAlts[currentHeroIndex];
        }

        if (heroCurrentSpan) {
            heroCurrentSpan.textContent = currentHeroIndex;
        }

        // Announce to screen readers
        announceToScreenReader(`Screenshot ${currentHeroIndex} of ${totalScreenshots}`);
    }

    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            currentHeroIndex = currentHeroIndex > 1 ? currentHeroIndex - 1 : totalScreenshots;
            updateHeroScreenshot();
        });
    }

    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            currentHeroIndex = currentHeroIndex < totalScreenshots ? currentHeroIndex + 1 : 1;
            updateHeroScreenshot();
        });
    }

    // ==========================================================================
    // Hero Theme Toggle
    // ==========================================================================

    const heroThemeToggle = document.querySelector('.hero-theme-toggle');
    const heroThemeBtns = document.querySelectorAll('.hero-theme-btn');

    if (heroThemeToggle && heroThemeBtns.length > 0) {
        heroThemeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                currentTheme = theme;

                // Update hero toggle active states
                heroThemeBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');

                // Update hero toggle indicator position
                const indicator = heroThemeToggle.querySelector('.hero-theme-indicator');
                if (theme === 'light') {
                    indicator.style.transform = 'translateX(100%)';
                } else {
                    indicator.style.transform = 'translateX(0)';
                }

                // Update hero screenshot
                updateHeroScreenshot();

                // Update all grid screenshots
                updateGridScreenshots();

                // Announce change to screen readers
                announceToScreenReader(`Screenshots changed to ${theme} mode`);
            });
        });
    }

    // ==========================================================================
    // Grid Screenshots Theme Update
    // ==========================================================================

    const screenshotGridImages = document.querySelectorAll('.screenshots-grid .screenshot-img');

    function updateGridScreenshots() {
        screenshotGridImages.forEach(img => {
            const newSrc = img.dataset[currentTheme];
            if (newSrc) {
                // Check for reduced motion preference
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.src = newSrc;
                        img.style.opacity = '1';
                    }, 150);
                } else {
                    img.src = newSrc;
                }
            }
        });
    }

    // ==========================================================================
    // Lightbox Modal
    // ==========================================================================

    const lightbox = document.getElementById('screenshot-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;
    const enlargeBtns = document.querySelectorAll('.screenshot-enlarge-btn');

    let lastFocusedElement = null;

    function openLightbox(imgSrc, imgAlt, caption) {
        if (!lightbox || !lightboxImg) return;

        lastFocusedElement = document.activeElement;

        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
        }

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        // Focus the close button for keyboard users
        setTimeout(() => {
            if (lightboxClose) {
                lightboxClose.focus();
            }
        }, 100);

        announceToScreenReader(`Enlarged view of ${caption} opened. Press Escape or the close button to close.`);
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.hidden = true;
        document.body.style.overflow = '';

        // Return focus to the element that opened the lightbox
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        announceToScreenReader('Enlarged view closed');
    }

    // Attach click handlers to enlarge buttons
    enlargeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.querySelector('.screenshot-img');
            const caption = btn.closest('.screenshot-grid-item').querySelector('figcaption').textContent;
            if (img) {
                openLightbox(img.src, img.alt, caption);
            }
        });
    });

    // Close lightbox handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });

    // Trap focus inside lightbox when open
    if (lightbox) {
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !lightbox.hidden) {
                // Only the close button is focusable, so trap focus there
                e.preventDefault();
                lightboxClose.focus();
            }
        });
    }

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');

            // Announce to screen readers
            announceToScreenReader(isExpanded ? 'Menu closed' : 'Menu opened');
        });

        // Close menu when clicking a nav link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                mobileMenuToggle.focus();
            }
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links (with reduced motion support)
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // Check for reduced motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }

                // Set focus to target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================

    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================

    // Only run animations if user hasn't requested reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should animate
        document.querySelectorAll('.feature-card, .category-card, .screenshot-grid-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animateOnScroll.observe(el);
        });

        // Add animate-in styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================================
    // Screen Reader Announcements
    // ==========================================================================

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        // Add sr-only styles if not already present
        if (!document.querySelector('style[data-sr-only]')) {
            const srStyle = document.createElement('style');
            srStyle.setAttribute('data-sr-only', 'true');
            srStyle.textContent = `
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `;
            document.head.appendChild(srStyle);
        }

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // ==========================================================================
    // Preload Images
    // ==========================================================================

    function preloadImages() {
        // Preload hero screenshots (all themes and indices)
        if (heroScreenshot) {
            for (let i = 1; i <= totalScreenshots; i++) {
                const darkSrc = heroScreenshot.dataset[`dark${i}`];
                const lightSrc = heroScreenshot.dataset[`light${i}`];
                if (darkSrc) {
                    const img = new Image();
                    img.src = darkSrc;
                }
                if (lightSrc) {
                    const img = new Image();
                    img.src = lightSrc;
                }
            }
        }

        // Preload grid screenshots (both themes)
        screenshotGridImages.forEach(img => {
            const lightSrc = img.dataset.light;
            const darkSrc = img.dataset.dark;

            if (lightSrc) {
                const lightImg = new Image();
                lightImg.src = lightSrc;
            }
            if (darkSrc) {
                const darkImg = new Image();
                darkImg.src = darkSrc;
            }
        });
    }

    // Preload after page load
    if (document.readyState === 'complete') {
        preloadImages();
    } else {
        window.addEventListener('load', preloadImages);
    }

    // ==========================================================================
    // Dynamic Year in Footer
    // ==========================================================================

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // Keyboard Navigation for Hero
    // ==========================================================================

    const heroPhoneWrapper = document.querySelector('.hero-phone-wrapper');
    if (heroPhoneWrapper) {
        heroPhoneWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentHeroIndex = currentHeroIndex > 1 ? currentHeroIndex - 1 : totalScreenshots;
                updateHeroScreenshot();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentHeroIndex = currentHeroIndex < totalScreenshots ? currentHeroIndex + 1 : 1;
                updateHeroScreenshot();
            }
        });
    }

    // ==========================================================================
    // Touch Swipe Support for Hero Carousel
    // ==========================================================================

    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        phoneMockup.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        phoneMockup.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) < minSwipeDistance) return;

            if (swipeDistance < 0) {
                // Swiped left - go to next
                currentHeroIndex = currentHeroIndex < totalScreenshots ? currentHeroIndex + 1 : 1;
                updateHeroScreenshot();
            } else {
                // Swiped right - go to previous
                currentHeroIndex = currentHeroIndex > 1 ? currentHeroIndex - 1 : totalScreenshots;
                updateHeroScreenshot();
            }
        }
    }

})();
