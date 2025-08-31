// DOM Elements
const roleCards = document.querySelectorAll('.role-card');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');
const passwordToggle = document.getElementById('passwordToggle');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const demoBtn = document.getElementById('demoBtn');
const signupLink = document.getElementById('signupLink');
const languageSelect = document.getElementById('language');

// State
let selectedRole = 'student';

// Role themes configuration
const roleThemes = {
    student: {
        name: 'Student',
        buttonText: 'Login as Student',
        theme: 'student-theme',
        redirectUrl: '/student-dashboard',
        demoUrl: '/student-demo'
    },
    teacher: {
        name: 'Teacher', 
        buttonText: 'Login as Teacher',
        theme: 'teacher-theme',
        redirectUrl: '/teacher-dashboard',
        demoUrl: '/teacher-demo'
    },
    parent: {
        name: 'Parent',
        buttonText: 'Login as Parent', 
        theme: 'parent-theme',
        redirectUrl: '/parent-dashboard',
        demoUrl: '/parent-demo'
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeRoleSelection();
    initializeFormHandlers();
    initializePasswordToggle();
    initializeDemoMode();
    initializeLanguageSelector();
    initializeGoogleSignIn();
    
    // Set default role
    selectRole('student');
});

// Role Selection Handler
function initializeRoleSelection() {
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.dataset.role;
            selectRole(role);
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const role = this.dataset.role;
                selectRole(role);
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
}

function selectRole(role) {
    selectedRole = role;
    const theme = roleThemes[role];
    
    // Update active role card
    roleCards.forEach(card => {
        card.classList.remove('active', 'student', 'teacher', 'parent');
        if (card.dataset.role === role) {
            card.classList.add('active', role);
        }
    });
    
    // Update body theme
    document.body.className = theme.theme;
    
    // Update login button text
    loginBtn.querySelector('span').textContent = theme.buttonText;
    
    // Update signup link
    signupLink.textContent = `Sign up as ${theme.name}`;
    
    // Add visual feedback
    addRippleEffect(document.querySelector(`[data-role="${role}"]`));
}

// Form Handlers
function initializeFormHandlers() {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Clear errors on input
    emailInput.addEventListener('input', clearFieldError);
    passwordInput.addEventListener('input', clearFieldError);
}

function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    
    if (!isValid) return;
    
    // Show loading state
    showLoadingState();
    
    // Simulate login process
    setTimeout(() => {
        hideLoadingState();
        
        // In a real app, this would make an API call
        console.log('Login attempt:', {
            email,
            role: selectedRole,
            remember
        });
        
        // Simulate successful login
        showSuccessMessage();
        
        // Redirect after delay
        setTimeout(() => {
            if (selectedRole === 'student') {
                window.location.href = 'student-dashboard.html';
            } else {
                window.location.href = roleThemes[selectedRole].redirectUrl;
            }
        }, 1500);
        
    }, 2000);
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formGroup = emailInput.closest('.form-group');
    
    if (!email) {
        showFieldError(formGroup, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(formGroup, 'Please enter a valid email address');
        return false;
    } else {
        showFieldSuccess(formGroup);
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value;
    const formGroup = passwordInput.closest('.form-group');
    
    if (!password) {
        showFieldError(formGroup, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showFieldError(formGroup, 'Password must be at least 6 characters');
        return false;
    } else {
        showFieldSuccess(formGroup);
        return true;
    }
}

function showFieldError(formGroup, message) {
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function showFieldSuccess(formGroup) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

function clearFieldError() {
    const formGroup = this.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

// Password Toggle
function initializePasswordToggle() {
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// Loading States
function showLoadingState() {
    const btnText = loginBtn.querySelector('span');
    const btnIcon = loginBtn.querySelector('i');
    
    btnText.textContent = 'Logging in...';
    btnIcon.className = 'loading';
    loginBtn.disabled = true;
}

function hideLoadingState() {
    const btnText = loginBtn.querySelector('span');
    const btnIcon = loginBtn.querySelector('i');
    
    btnText.textContent = roleThemes[selectedRole].buttonText;
    btnIcon.className = 'fas fa-arrow-right';
    loginBtn.disabled = false;
}

function showSuccessMessage() {
    const btnText = loginBtn.querySelector('span');
    const btnIcon = loginBtn.querySelector('i');
    
    btnText.textContent = 'Login Successful!';
    btnIcon.className = 'fas fa-check';
    loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
}

// Demo Mode
function initializeDemoMode() {
    demoBtn.addEventListener('click', function() {
        // Show loading state
        this.innerHTML = '<i class="loading"></i> Loading Demo...';
        this.disabled = true;
        
        // Simulate demo loading
        setTimeout(() => {
            if (selectedRole === 'student') {
                window.location.href = 'student-dashboard.html';
            } else {
                window.location.href = roleThemes[selectedRole].demoUrl;
            }
        }, 1500);
    });
}

// Language Selector
function initializeLanguageSelector() {
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        
        // In a real app, this would change the page language
        console.log('Language changed to:', selectedLang);
        
        // Show feedback
        this.style.background = '#f0f9ff';
        setTimeout(() => {
            this.style.background = '';
        }, 300);
    });
}

// Visual Effects
function addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Quick role selection with number keys
    if (e.key >= '1' && e.key <= '3') {
        const roles = ['student', 'teacher', 'parent'];
        const roleIndex = parseInt(e.key) - 1;
        if (roles[roleIndex]) {
            selectRole(roles[roleIndex]);
        }
    }
    
    // Enter key on role cards
    if (e.key === 'Enter' && e.target.classList.contains('role-card')) {
        e.target.click();
    }
});

// Smooth scroll for mobile
function smoothScrollToForm() {
    if (window.innerWidth <= 1024) {
        document.querySelector('.right-panel').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Add click handlers for role cards to trigger smooth scroll on mobile
roleCards.forEach(card => {
    card.addEventListener('click', smoothScrollToForm);
});

// Form auto-focus
window.addEventListener('load', function() {
    if (window.innerWidth > 768) {
        emailInput.focus();
    }
});

// Handle form submission with Enter key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.target === emailInput || e.target === passwordInput)) {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// Signup link handler
signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    
    const role = selectedRole;
    
    if (role === 'student') {
        window.location.href = 'student-signup.html';
    } else {
        // For other roles, show coming soon message
        alert(`${role.charAt(0).toUpperCase() + role.slice(1)} signup coming soon!`);
    }
});

// Forgot password handler
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    
    // In a real app, this would open forgot password modal/page
    console.log('Opening forgot password flow');
    
    // Simulate navigation
    window.location.href = '/forgot-password';
});

// Add some easter eggs for SIH judges
let konami = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konami.push(e.keyCode);
    konami = konami.slice(-konamiCode.length);
    
    if (konami.join('') === konamiCode.join('')) {
        // Easter egg activated
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 4000);
    }
});

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Google Sign-In
function initializeGoogleSignIn() {
    const googleBtn = document.getElementById('googleLoginBtn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<div class="loading"></div> Connecting to Google...';
            this.disabled = true;
            
            // Simulate Google OAuth flow
            setTimeout(() => {
                handleGoogleSignIn();
            }, 2000);
        });
    }
}

function handleGoogleSignIn() {
    // Simulate Google OAuth response
    const googleUserData = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'student@gmail.com',
        name: 'Google User',
        given_name: 'Google',
        family_name: 'User',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    };
    
    // Store Google user data
    const studentData = {
        firstName: googleUserData.given_name,
        lastName: googleUserData.family_name,
        fullName: googleUserData.name,
        email: googleUserData.email,
        grade: 'college',
        signupDate: new Date().toISOString(),
        level: 1,
        xp: 0,
        streakDays: 0,
        loginMethod: 'google',
        googleId: googleUserData.id,
        profilePicture: googleUserData.picture
    };
    
    localStorage.setItem('eduverse_student', JSON.stringify(studentData));
    localStorage.setItem('eduverse_logged_in', 'true');
    localStorage.setItem('eduverse_user_role', 'student');
    
    // Show success and redirect
    const googleBtn = document.getElementById('googleLoginBtn');
    googleBtn.innerHTML = '<i class="fas fa-check"></i> Google Login Successful!';
    googleBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    googleBtn.style.color = 'white';
    googleBtn.style.borderColor = '#10b981';
    
    setTimeout(() => {
        if (selectedRole === 'student') {
            window.location.href = 'student-dashboard.html';
        } else {
            window.location.href = roleThemes[selectedRole].redirectUrl;
        }
    }, 1500);
}
