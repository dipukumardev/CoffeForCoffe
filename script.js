// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navWrapper = document.querySelector('.nav-wrapper');
const navItems = document.querySelectorAll('.nav-item');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Navigation Functionality
// Navbar scroll effect
const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
};

// Mobile menu toggle
const toggleMobileMenu = () => {
    navWrapper?.classList.toggle('active');
    hamburger?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Animate hamburger lines
    const spans = hamburger?.querySelectorAll('span');
    if (spans) {
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
};

// Dropdown menu functionality for mobile
const handleDropdownClick = (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        const navItem = e.target.closest('.nav-item');
        const wasActive = navItem.classList.contains('active');
        
        // Close all dropdowns
        navItems.forEach(item => item.classList.remove('active'));
        
        // Toggle current dropdown
        if (!wasActive) {
            navItem.classList.add('active');
        }
    }
};

// Event Listeners for Navigation
window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
hamburger?.addEventListener('click', toggleMobileMenu);

// Handle dropdown clicks on mobile
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.querySelector('.dropdown-arrow')) {
        link.addEventListener('click', handleDropdownClick);
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && navWrapper?.classList.contains('active')) {
        if (!e.target.closest('.nav-wrapper') && !e.target.closest('.hamburger')) {
            toggleMobileMenu();
        }
    }
});

// Reveal on Scroll Animation
const revealOnScroll = () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible && elementBottom > 0) {
            element.classList.add('active');
        }
    });
};

// Counter Animation
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const animate = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                requestAnimationFrame(animate);
            } else {
                counter.innerText = target;
            }
        };
        
        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
};

// Machine Card Interactions
const initMachineCards = () => {
    document.querySelectorAll('.machine-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
};

// Button Interactions
const initButtonEffects = () => {
    // Favorite/Compare buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            // Create ripple effect
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // View specifications buttons
    document.querySelectorAll('.view-specs').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const machineName = this.closest('.machine-card')?.querySelector('h3')?.textContent;
            console.log(`View specs for: ${machineName}`);
            // Implement modal or navigation here
        });
    });
};

// Testimonial Slider
const initTestimonialSlider = () => {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    const showTestimonial = (index) => {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };
    
    // Auto-play
    const autoPlay = () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    };
    
    let interval = setInterval(autoPlay, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
            clearInterval(interval);
            interval = setInterval(autoPlay, 5000);
        });
    });
};

// Testimonial Card Hover Effect
const initTestimonialCards = () => {
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
};

// Clients Logo Infinite Scroll
const initClientsSlider = () => {
    const clientsTrack = document.querySelector('.clients-track');
    if (clientsTrack) {
        const logos = clientsTrack.innerHTML;
        clientsTrack.innerHTML = logos + logos;
    }
};

// Parallax Effects
const initParallax = () => {
    const heroVideo = document.querySelector('.hero-video-bg');
    const heroOverlay = document.querySelector('.hero-overlay');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        if (heroOverlay) {
            heroOverlay.style.opacity = 0.5 + (scrolled * 0.001);
        }
    }, 16));
};

// Contact Form Validation
const initContactForm = () => {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Submit form or show success message
                console.log('Form submitted successfully');
                this.reset();
            }
        });
        
        // Remove error class on input
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
};

// Smooth Scroll for Anchor Links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navWrapper?.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
};

// Dynamic Styles
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .testimonial-card::before {
            content: '';
            position: absolute;
            top: var(--y);
            left: var(--x);
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(232, 176, 75, 0.3) 0%, transparent 70%);
            transition: width 0.6s, height 0.6s;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }
        
        .testimonial-card:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .error {
            border-color: #e74c3c !important;
        }
        
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
};

// Initialize Everything
const init = () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize all features
    initMachineCards();
    initButtonEffects();
    initTestimonialSlider();
    initTestimonialCards();
    initClientsSlider();
    initParallax();
    initContactForm();
    initSmoothScroll();
    animateCounters();
    
    // Initial scroll check
    handleNavbarScroll();
    revealOnScroll();
};

// Event Listeners
window.addEventListener('scroll', debounce(revealOnScroll, 100));
window.addEventListener('load', init);
window.addEventListener('resize', debounce(() => {
    // Handle resize events
    if (window.innerWidth > 768) {
        navWrapper?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.classList.remove('menu-open');
        navItems.forEach(item => item.classList.remove('active'));
    }
}, 250));

// Export functions for use in other scripts if needed
window.CoffeeMachine = {
    toggleMobileMenu,
    revealOnScroll,
    animateCounters
};