document.addEventListener('DOMContentLoaded', function() {
    // Initialize features
    loadFeatures();
    
    // Initialize all interactive elements
    initializeNavigation();
    initializeModals();
    initializeForms();
    initializeScrollEffects();
    });
    
    // Dynamic Features Loading
    function loadFeatures() {
    const features = [
    {
    title: 'Flashcards',
    description: 'Create and study with digital flashcards. Perfect for memorization and quick reviews.',
    icon: '📚'
    },
    {
    title: 'Quizzes',
    description: 'Test your knowledge with interactive quizzes. Track your progress and identify areas for improvement.',
    icon: '✍️'
    },
    {
    title: 'Study Groups',
    description: 'Join or create study groups. Share materials and learn together with your peers.',
    icon: '👥'
    }
    ];
    
    const featuresList = document.getElementById('featuresList');
    if (featuresList) {
        featuresList.innerHTML = features.map(feature => `
            <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div class="text-4xl mb-4">${feature.icon}</div>
                <h3 class="text-xl font-bold mb-4">${feature.title}</h3>
                <p class="text-gray-600">${feature.description}</p>
            </div>
        `).join('');
    }
    }
    
    function initializeNavigation() {
    // Handle navigation links
    document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('href');
    scrollToSection(target);
    });
    });
    
    // Handle "Get Started" button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            document.getElementById('signupModal').classList.remove('hidden');
        });
    }
    }
    
    function initializeModals() {
    // Modal triggers
    const modalTriggers = {
    'loginBtn': 'loginModal',
    'signupBtn': 'signupModal'
    };
    
    // Setup modal triggers
    Object.entries(modalTriggers).forEach(([triggerId, modalId]) => {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        
        if (trigger && modal) {
            trigger.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        }
    });
    
    // Close modal functionality
    document.querySelectorAll('.closeModal').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.fixed');
            if (modal) modal.classList.add('hidden');
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('fixed')) {
            e.target.classList.add('hidden');
        }
    });
    }
    
    function initializeForms() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = getFormData(loginForm);
    await handleAuth('/api/auth/login', formData);
    });
    }
    
    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = getFormData(signupForm);
            await handleAuth('/api/auth/register', formData);
        });
    }
    }
    
    function initializeScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavHighlight();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    updateNavHighlight();
    }
    
    // Helper Functions
    function scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
    const navHeight = document.querySelector('nav').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
    top: elementPosition - navHeight,
    behavior: 'smooth'
    });
    }
    }
    
    function getFormData(form) {
    return Object.fromEntries(new FormData(form));
    }
    
    async function handleAuth(url, data) {
    try {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });
    
        const result = await response.json();
    
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userName', result.user.name);
            showMessage('Success! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showMessage(result.error || 'Authentication failed', 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
        console.error('Auth error:', error);
    }
    }
    
    function updateNavHighlight() {
    const scrollPosition = window.scrollY + 100; // Offset for nav height
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const navLink = document.querySelector(`[data-nav="${section.id}"]`);
        
        if (navLink) {
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLink.classList.add('text-indigo-600');
                navLink.classList.remove('text-gray-700');
            } else {
                navLink.classList.remove('text-indigo-600');
                navLink.classList.add('text-gray-700');
            }
        }
    });
    }
    
    function showMessage(message, type = 'info') {
    const flashMessages = document.getElementById('flashMessages');
    const alert = document.createElement('div');
    
    alert.className = `
        p-4 mb-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all
        ${type === 'error' 
            ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-100 border-l-4 border-green-500 text-green-700'
        }
    `;
    
    alert.textContent = message;
    flashMessages.appendChild(alert);
    
    // Animate out
    setTimeout(() => {
        alert.style.transform = 'translateY(-10px)';
        alert.style.opacity = '0';
    }, 2500);
    
    // Remove from DOM
    setTimeout(() => {
        alert.remove();
    }, 3000);
    }
    