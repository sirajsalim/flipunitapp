/**
 * Flip Unit Landing Page - JavaScript
 * Handles interactivity while respecting accessibility preferences
 */

(function() {
    'use strict';

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

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        announceToScreenReader('Enlarged view closed');
    }

    enlargeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.querySelector('.screenshot-img');
            const caption = btn.closest('.screenshot-grid-item').querySelector('figcaption').textContent;
            if (img) {
                openLightbox(img.src, img.alt, caption);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });

    if (lightbox) {
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !lightbox.hidden) {
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

            announceToScreenReader(isExpanded ? 'Menu closed' : 'Menu opened');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        });

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

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }

                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================

    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.boxShadow = 'none';
            }
        }, { passive: true });
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================

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

        document.querySelectorAll('.feature-card, .category-card, .screenshot-grid-item, .widget-card, .watch-feature').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animateOnScroll.observe(el);
        });

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

        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // ==========================================================================
    // Dynamic Year in Footer
    // ==========================================================================

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

})();
