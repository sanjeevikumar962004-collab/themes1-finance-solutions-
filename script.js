document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active'); // Add active class to button

        // Toggle icon between bars and times (X)
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked (optional, but good UX)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only close if we are on mobile (check if menu toggle is visible)
            if (getComputedStyle(mobileMenuBtn).display !== 'none') {
                if (link.parentElement.classList.contains('has-dropdown')) {
                    e.preventDefault(); // Stop instant navigation
                    link.parentElement.classList.toggle('mobile-open');

                    const icon = link.querySelector('.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = link.parentElement.classList.contains('mobile-open') ? 'rotate(180deg)' : 'rotate(0deg)';
                        icon.style.transition = 'transform 0.3s ease';
                    }
                    return; // Prevent closing the menu
                }

                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Services Carousel Navigation
    const servicesCarousel = document.getElementById('servicesCarousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (servicesCarousel && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = servicesCarousel.querySelector('.service-card').offsetWidth;
            const gap = 24; // Matches CSS gap
            servicesCarousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = servicesCarousel.querySelector('.service-card').offsetWidth;
            const gap = 24;
            servicesCarousel.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });
    }

    // About Section Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Show corresponding tab pane
                const targetId = btn.getAttribute('data-target');
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // Dashboard Tabs
    const dSideItems = document.querySelectorAll('.d-side-item a[data-target]');
    const dTabPanes = document.querySelectorAll('.d-tab-pane');

    if (dSideItems.length > 0 && dTabPanes.length > 0) {
        dSideItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all side items
                document.querySelectorAll('.d-side-item').forEach(li => li.classList.remove('active'));

                // Add active class to clicked item's parent li
                item.parentElement.classList.add('active');

                // Hide all tab panes
                dTabPanes.forEach(pane => pane.classList.remove('active'));

                // Show target tab pane
                const targetId = item.getAttribute('data-target');
                const targetPane = document.querySelector(targetId);

                if (targetPane) {
                    targetPane.classList.add('active');
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                    if (typeof gsap !== 'undefined') {
                        const elements = targetPane.querySelectorAll('.gs-fade-up, .gs-stagger-card');
                        if (elements.length > 0) {
                            gsap.fromTo(elements,
                                { y: 30, opacity: 0 },
                                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: true }
                            );
                        }
                    }
                }
            });
        });
    }

    // Number Counter Animation
    const expNumberElement = document.querySelector('.exp-number');

    // Check if element exists before setting up observer
    if (expNumberElement) {
        // We get the target number and plus sign from the HTML
        const targetNumberText = expNumberElement.textContent.replace('+', '').trim();
        const targetNumber = parseInt(targetNumberText, 10);
        const plusSpanHTML = '<span class="plus">+</span>';

        // Start it at 0
        expNumberElement.innerHTML = `0${plusSpanHTML}`;

        let hasAnimated = false; // Prevent it from animating every time you scroll past

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true; // Mark as animated
                    let currentNumber = 0;
                    const duration = 2000; // 2 seconds
                    const interval = 20; // Update every 20ms
                    const steps = duration / interval;
                    const increment = targetNumber / steps;

                    const timer = setInterval(() => {
                        currentNumber += increment;

                        if (currentNumber >= targetNumber) {
                            clearInterval(timer);
                            currentNumber = targetNumber; // Ensure we hit exactly the target at the end
                        }

                        // Update DOM: Math.floor removes decimals, and we append the + span back
                        expNumberElement.innerHTML = `${Math.floor(currentNumber)}${plusSpanHTML}`;
                    }, interval);
                }
            });
        }, {
            threshold: 0.5
        }); // Start when 50% of the circle is in view

        counterObserver.observe(document.querySelector('.experience-circle'));
    }

    // FAQ Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            accordionItems.forEach(acc => {
                acc.classList.remove('active');
                const content = acc.querySelector('.accordion-content');
                if (content) content.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Initialize first accordion item height
    const firstAccordion = document.querySelector('.accordion-item.active .accordion-content');
    if (firstAccordion) {
        firstAccordion.style.maxHeight = firstAccordion.scrollHeight + 'px';
    }

    // Scroll to Top Button Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Chart.js implementation (with Intersection Observer for animation on scroll)
    const ctx = document.getElementById('financeChart');
    if (ctx) {
        let chartInstance = null;

        const targetData1 = [125, 105, 130, 170, 115, 112, 185];
        const targetData2 = [175, 145, 148, 195, 190, 118, 160];

        const initChart = () => {
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: '2021',
                            data: [0, 0, 0, 0, 0, 0], // Start at 0 for animation
                            backgroundColor: '#1e382d', // Deep Theme Green
                            borderColor: '#ffffff', // White
                            borderWidth: 2,
                            barPercentage: 0.6,
                            categoryPercentage: 0.8
                        },
                        {
                            label: '2022',
                            data: [0, 0, 0, 0, 0, 0], // Start at 0 for animation
                            backgroundColor: '#4a6b58', // Light Theme Green
                            borderColor: '#ffffff', // White
                            borderWidth: 2,
                            barPercentage: 0.6,
                            categoryPercentage: 0.8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart',
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10,
                                padding: 20,
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 12
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 200,
                            ticks: {
                                stepSize: 40,
                                font: { family: "'Inter', sans-serif" }
                            },
                            grid: {
                                color: '#eaeaea',
                                drawBorder: false
                            },
                            border: { display: false }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: true
                            },
                            ticks: {
                                font: { family: "'Inter', sans-serif" }
                            },
                            border: { display: true, color: '#1a1a1a' }
                        }
                    }
                }
            });

            // Trigger the animation by updating data after initialization
            setTimeout(() => {
                chartInstance.data.datasets[0].data = targetData1;
                chartInstance.data.datasets[1].data = targetData2;
                chartInstance.update();
            }, 100);
        };

        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !chartInstance) {
                    initChart();
                    chartObserver.unobserve(entry.target);

                    // Force resize on window change to ensure responsiveness
                    window.addEventListener('resize', () => {
                        if (chartInstance) {
                            chartInstance.resize();
                        }
                    });
                }
            });
        }, { threshold: 0.3 }); // Wait until 30% of the chart container is visible

        chartObserver.observe(document.querySelector('.chart-container'));
    }

    // =========================================
    // TESTIMONIALS CAROUSEL (About Page)
    // =========================================
    const testiSlides = document.querySelectorAll('.testi-slide');
    const testiDots = document.querySelectorAll('.testi-dots .dot');
    const testiPrevBtn = document.querySelector('.testi-arrow.prev');
    const testiNextBtn = document.querySelector('.testi-arrow.next');

    // Only run if elements exist on the current page
    if (testiSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = testiSlides.length;

        function goToSlide(index) {
            // Remove active class from all
            testiSlides.forEach(slide => slide.classList.remove('active'));
            testiDots.forEach(dot => dot.classList.remove('active'));

            // Add active class to target
            testiSlides[index].classList.add('active');
            testiDots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let newIndex = currentSlide + 1;
            if (newIndex >= totalSlides) newIndex = 0;
            goToSlide(newIndex);
        }

        function prevSlide() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = totalSlides - 1;
            goToSlide(newIndex);
        }

        // Event Listeners for Arrows
        if (testiNextBtn) testiNextBtn.addEventListener('click', nextSlide);
        if (testiPrevBtn) testiPrevBtn.addEventListener('click', prevSlide);

        // Event Listeners for Dots
        testiDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Optional: Auto-play functionality (uncomment to enable)
        // setInterval(nextSlide, 6000); 
    }
});

/* =========================================
   DASHBOARD TAB NAVIGATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const dashboardTabs = document.querySelectorAll('.d-side-item a[data-target]');
    const dashboardPanes = document.querySelectorAll('.d-tab-pane');

    if (dashboardTabs.length > 0) {
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();

                // Remove active class from all sidebar items
                dashboardTabs.forEach(t => t.parentElement.classList.remove('active'));

                // Add active class to clicked item
                this.parentElement.classList.add('active');

                // Get target pane ID
                const targetId = this.getAttribute('data-target');

                // Hide all panes
                dashboardPanes.forEach(pane => {
                    pane.classList.remove('active');
                    // Reset animation for re-triggering
                    const animatedItems = pane.querySelectorAll('.animate-slide-up');
                    animatedItems.forEach(item => {
                        item.style.animation = 'none';
                        item.offsetHeight; /* trigger reflow */
                        item.style.animation = null;
                    });
                });

                // Show target pane
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
});

/* =========================================
   PRELOADER
   ========================================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800); // 800ms delay so the beautiful animation is visible for a moment
    }
});

/* =========================================
   AUTHENTICATION & FORM VALIDATION ROUTING
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Helper to simulate routing to 404 on successful form submission
    const routeTo404 = (e) => {
        e.preventDefault(); // Stop actual form submission

        // Custom Validation
        const form = e.target;

        // 1. Name Validation (No numbers allowed)
        const nameInputs = form.querySelectorAll('input[type="text"][id*="name" i], input[type="text"][placeholder*="name" i]');
        for (const input of nameInputs) {
            if (/\d/.test(input.value)) {
                alert("Please enter a valid name. Numeric characters are not allowed.");
                input.focus();
                return; // Stop submission
            }
        }

        // 2. Phone Validation (Numbers only, exactly 10 digits)
        const phoneInputs = form.querySelectorAll('input[type="tel"], input[id*="phone" i], input[placeholder*="phone" i]');
        for (const input of phoneInputs) {
            if (input.value.trim() !== "") {
                const numericOnly = input.value.replace(/\D/g, '');
                if (numericOnly.length !== 10) {
                    alert("Please enter a valid 10-digit phone number.");
                    input.focus();
                    return;
                }
            }
        }

        // 3. Email Validation (Whitelisted domains + strict lowercase check)
        const allowedDomains = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
            'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
            'zoho.com', 'yandex.com', 'rediffmail.com', 'msn.com', 'gmx.com',
            'mail.com', 'inbox.com', 'fastmail.com', 'tutanota.com'
        ];
        const emailInputs = form.querySelectorAll('input[type="email"]');
        for (const input of emailInputs) {
            const emailValue = input.value.trim();
            if (emailValue !== "") {
                const atIndex = emailValue.indexOf('@');
                if (atIndex !== -1) {
                    const domain = emailValue.substring(atIndex + 1);

                    // 1. Reject if domain has any uppercase characters
                    if (/[A-Z]/.test(domain)) {
                        alert("Please enter your email domain in lowercase (e.g., gmail.com instead of GMAIL.COM).");
                        input.focus();
                        return;
                    }

                    // 2. Reject if domain is not in the accepted whitelist
                    if (!allowedDomains.includes(domain)) {
                        alert("Please use a valid email provider (e.g., gmail.com, outlook.com, yahoo.com).");
                        input.focus();
                        return;
                    }
                }
            }
        }

        // Brief loading simulation (e.g., spinning button icon)
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                window.location.href = '404.html';
            }, 800);
        } else {
            window.location.href = '404.html';
        }
    };

    // 1. Password Visibility Toggle
    const togglePasswords = document.querySelectorAll('.toggle-password');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            }
        });
    });

    // 2. Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', routeTo404);
    }

    // 2. Signup Form (with custom password matching constraint)
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const passwordInput = document.getElementById('signupPassword');
        const confirmInput = document.getElementById('signupConfirm');
        const mismatchError = document.getElementById('passwordMismatchError');

        signupForm.addEventListener('submit', (e) => {
            // Check if passwords match
            if (passwordInput.value !== confirmInput.value) {
                e.preventDefault(); // Stop submission
                mismatchError.classList.remove('hidden');
                confirmInput.style.borderColor = '#d93025'; // Red border
                return; // Exit early
            }

            // If they match, clear error and route
            mismatchError.classList.add('hidden');
            confirmInput.style.borderColor = '#e1e8e5'; // Reset border
            routeTo404(e);
        });

        // Clear error on user typing
        confirmInput.addEventListener('input', () => {
            if (passwordInput.value === confirmInput.value) {
                mismatchError.classList.add('hidden');
                confirmInput.style.borderColor = '#e1e8e5';
            }
        });
    }

    // 3. Forgot Password Form
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', routeTo404);
    }

    // 4. All other generic forms (Newsletters, Contact Form, Searches)
    const genericForms = document.querySelectorAll('form.newsletter-form, form.sidebar-search-form, form.modern-contact-form:not([id]), form.d-form');
    genericForms.forEach(form => {
        // Prevent default submission on button click and trigger 404 route
        form.addEventListener('submit', (e) => {
            routeTo404(e);
        });
    });

    // 5. Global Phone Input Constraint (Numbers only, max 10)
    const phoneFields = document.querySelectorAll('input[type="tel"], input[id*="phone" i], input[placeholder*="phone" i]');
    phoneFields.forEach(field => {
        // Only apply to fields NOT in the dashboard (per user request)
        if (!field.closest('.dashboard-wrapper')) {
            field.addEventListener('input', function (e) {
                // Remove non-digits
                let value = this.value.replace(/\D/g, '');
                // Limit to 10 characters
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                this.value = value;
            });
        }
    });

    // 6. Global catch-all for remaining empty anchor buttons
    const emptyLinks = document.querySelectorAll('a[href="#"]');
    emptyLinks.forEach(link => {
        // Exclude dynamic elements like tabs that use explicit internal paths
        if (!link.hasAttribute('data-target') && !link.classList.contains('menu-toggle')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                routeTo404(e);
            });
        }
    });
});

/* =========================================
   GLOBAL GSAP ANIMATIONS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Fade Up Elements (.gs-fade-up)
        gsap.utils.toArray('.gs-fade-up').forEach(elem => {
            gsap.fromTo(elem,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // 2. Fade Left Elements (.gs-fade-left)
        gsap.utils.toArray('.gs-fade-left').forEach(elem => {
            gsap.fromTo(elem,
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // 3. Fade In Elements (.gs-fade-in)
        gsap.utils.toArray('.gs-fade-in').forEach(elem => {
            gsap.fromTo(elem,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // 4. Text Reveal Elements (.gs-text-reveal)
        const textElements = gsap.utils.toArray('.gs-text-reveal');
        if (textElements.length > 0) {
            gsap.fromTo(textElements,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: textElements[0], // Trigger based on the first item in viewport group usually
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // To ensure multiple disconnected text reveals fire correctly, we also bind each individually if they are far apart
            textElements.forEach(elem => {
                gsap.to(elem, {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 90%",
                        once: true,
                        onEnter: () => gsap.to(elem, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
                    }
                });
            });
        }

        // 5. Staggered Cards Grid (.gs-stagger-card)
        ScrollTrigger.batch(".gs-stagger-card", {
            onEnter: batch => gsap.fromTo(batch,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" }
            ),
            start: "top 85%",
            once: true
        });
    }
});

/* =========================================
   DASHBOARD TRANSACTIONS FILTER & PAGINATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Transaction Filtering
    const txFilter = document.querySelector('#tab-transactions .d-filters select.d-input');
    const txRows = document.querySelectorAll('#tab-transactions .d-table tbody tr');

    if (txFilter && txRows.length > 0) {
        txFilter.addEventListener('change', (e) => {
            const selectedStatus = e.target.value.toLowerCase().trim();

            txRows.forEach(row => {
                const statusBadge = row.querySelector('td:nth-child(4) .d-badge');
                if (statusBadge) {
                    const rowStatus = statusBadge.textContent.toLowerCase().trim();
                    if (selectedStatus === 'all status' || selectedStatus === 'all') {
                        row.style.display = '';
                    } else if (rowStatus === selectedStatus) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Pagination 404 routing
    const pageBtns = document.querySelectorAll('.d-page-btn');
    if (pageBtns.length > 0) {
        pageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = './404.html';
            });
        });
    }
});
