/**
 * Flip Unit Landing Page - JavaScript
 * Handles interactivity while respecting accessibility preferences
 */

(function() {
    'use strict';

    // ==========================================================================
    // Screenshot Theme Toggle
    // ==========================================================================

    const screenshotToggle = document.querySelector('.screenshot-toggle');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const screenshotImages = document.querySelectorAll('.screenshot-img');

    if (screenshotToggle && toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;

                // Update active states
                toggleBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');

                // Update toggle indicator position
                const indicator = screenshotToggle.querySelector('.toggle-indicator');
                if (theme === 'light') {
                    indicator.style.transform = 'translateX(100%)';
                } else {
                    indicator.style.transform = 'translateX(0)';
                }

                // Swap screenshot images
                screenshotImages.forEach(img => {
                    const newSrc = img.dataset[theme];
                    if (newSrc) {
                        // Add fade effect if reduced motion is not preferred
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

                // Announce change to screen readers
                announceToScreenReader(`Screenshots changed to ${theme} mode`);
            });
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
    // Screenshot Carousel Keyboard Navigation
    // ==========================================================================

    const screenshotsCarousel = document.querySelector('.screenshots-carousel');

    if (screenshotsCarousel) {
        screenshotsCarousel.addEventListener('keydown', (e) => {
            const scrollAmount = 240; // Approximate width of one screenshot

            if (e.key === 'ArrowRight') {
                screenshotsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft') {
                screenshotsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        });

        // Make carousel focusable for keyboard users
        screenshotsCarousel.setAttribute('tabindex', '0');
        screenshotsCarousel.setAttribute('role', 'region');
        screenshotsCarousel.setAttribute('aria-label', 'App screenshots carousel. Use arrow keys to scroll.');
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
        document.querySelectorAll('.feature-card, .category-card, .screenshot-item').forEach(el => {
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
    // Preload Images for Theme Toggle
    // ==========================================================================

    function preloadImages() {
        screenshotImages.forEach(img => {
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

})();
