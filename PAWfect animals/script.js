// =============================================
// MOBILE MENU TOGGLE (All Pages)
// =============================================
class MobileMenu {
    constructor() {
        this.menuButton = document.querySelector('.VET');
        this.nav = document.querySelector('nav .container ul');
        this.init();
    }
    
    init() {
        if (this.menuButton && this.nav) {
            this.menuButton.addEventListener('click', () => this.toggleMenu());
        }
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        this.menuButton.classList.toggle('active');
    }
}

// =============================================
// TEAM INTERACTIONS (OUR TEAM Page)
// =============================================
class TeamInteractions {
    constructor() {
        this.teamMembers = document.querySelectorAll('main h3');
        this.init();
    }
    
    init() {
        this.teamMembers.forEach(member => {
            member.style.cursor = 'pointer';
            member.addEventListener('click', () => this.toggleMemberBio(member));
        });
    }
    
    toggleMemberBio(member) {
        const bio = member.nextElementSibling;
        if (bio && bio.tagName === 'P') {
            bio.style.display = bio.style.display === 'none' ? 'block' : 'none';
        }
    }
}

// =============================================
// IMAGE GALLERY LIGHTBOX (OUR TEAM Page)
// =============================================
class TeamGallery {
    constructor() {
        this.images = document.querySelectorAll('main img');
        this.init();
    }
    
    init() {
        this.images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => this.openLightbox(img));
        });
        
        this.createLightboxHTML();
    }
    
    createLightboxHTML() {
        const lightboxHTML = `
            <div class="lightbox" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center;">
                <span class="close" style="position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer; z-index: 1001;">&times;</span>
                <img class="lightbox-content" style="max-width: 90%; max-height: 90%; border-radius: 10px;">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Add event listeners
        document.querySelector('.lightbox .close').addEventListener('click', () => this.close());
        document.querySelector('.lightbox').addEventListener('click', (e) => {
            if (e.target === document.querySelector('.lightbox')) {
                this.close();
            }
        });
    }
    
    openLightbox(img) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = document.querySelector('.lightbox-content');
        
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
    }
    
    close() {
        document.querySelector('.lightbox').style.display = 'none';
    }
}

// =============================================
// FORM VALIDATION (CONTACT US Page)
// =============================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'text':
            case 'tel':
                if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                break;
            case 'select-one':
                if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'Please select an option';
                }
                break;
        }
        
        if (field.id === 'phone' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
    }
    
    showError(field, message) {
        this.clearError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.8em';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        let isFormValid = true;
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            await this.submitForm();
        }
    }
    
    async submitForm() {
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            pet: document.getElementById('pet')?.value,
            subject: document.getElementById('subject')?.value,
            message: document.getElementById('message')?.value
        };
        
        try {
            this.form.classList.add('loading');
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showSuccess('Message sent successfully! We will get back to you within 24 hours.');
            this.form.reset();
            
        } catch (error) {
            this.showError(this.form, 'Failed to send message. Please try again or call us directly.');
        } finally {
            this.form.classList.remove('loading');
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    }
    
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.color = 'green';
        successDiv.style.background = '#f0fff0';
        successDiv.style.padding = '15px';
        successDiv.style.borderRadius = '5px';
        successDiv.style.margin = '15px 0';
        successDiv.style.border = '1px solid #00ff00';
        
        this.form.prepend(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// =============================================
// INTERACTIVE MAP (CONTACT US Page)
// =============================================
class InteractiveMap {
    constructor() {
        this.mapContainer = document.querySelector('.map-placeholder');
        this.init();
    }
    
    init() {
        if (this.mapContainer && typeof L !== 'undefined') {
            this.createMap();
        }
    }
    
    createMap() {
        this.mapContainer.innerHTML = `
            <div id="map" style="height: 200px; width: 57%; border-radius: 10px;"></div>
        `;
        
        const map = L.map('map').setView([-26.2485, 27.854], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}/.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([-26.2485, 27.854])
            .addTo(map)
            .bindPopup(`
                <strong>PAWfect Animals Veterinary Practice</strong><br>
                123 Animal Street, Soweto<br>
                Johannesburg, South Africa
            `)
            .openPopup();
    }
}

// =============================================
// SMOOTH SCROLLING (All Pages)
// =============================================
class SmoothScroller {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// =============================================
// SEARCH FUNCTIONALITY (For Future Use)
// =============================================
class SearchFeature {
    constructor() {
        this.searchInput = document.getElementById('search');
        this.resultsContainer = document.getElementById('results');
        if (this.searchInput && this.resultsContainer) {
            this.init();
        }
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    async handleSearch(query) {
        if (query.length < 2) {
            this.resultsContainer.innerHTML = '';
            return;
        }
        
        const results = await this.searchData(query);
        this.displayResults(results);
    }
    
    async searchData(query) {
        // This would typically call an API
        // For now, we'll search through page content
        const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');
        const results = [];
        
        searchableElements.forEach(element => {
            if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    title: element.tagName,
                    content: element.textContent,
                    element: element
                });
            }
        });
        
        return results.slice(0, 5); // Limit to 5 results
    }
    
    displayResults(results) {
        this.resultsContainer.innerHTML = results.map(item => `
            <div class="search-result" style="padding: 10px; border-bottom: 1px solid #ccc; cursor: pointer;">
                <h4>${item.title}</h4>
                <p>${item.content.substring(0, 100)}...</p>
            </div>
        `).join('');
        
        // Add click handlers to results
        this.resultsContainer.querySelectorAll('.search-result').forEach((result, index) => {
            result.addEventListener('click', () => {
                results[index].element.scrollIntoView({ behavior: 'smooth' });
                this.resultsContainer.innerHTML = '';
                this.searchInput.value = '';
            });
        });
    }
}

// =============================================
// NOTIFICATION SYSTEM (All Pages)
// =============================================
class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            font-weight: bold;
            ${type === 'success' ? 'background: #28a745;' : 
              type === 'error' ? 'background: #dc3545;' : 
              'background: #17a2b8;'}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// =============================================
// PAGE LOADER (All Pages)
// =============================================
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        // Add loading state to page
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
                document.body.style.transition = 'opacity 0.3s ease-in';
            }, 100);
        });
    }
}

// =============================================
// MAIN INITIALIZATION FUNCTION
// =============================================
function initializePage() {
    // Always initialize these (work on all pages)
    new MobileMenu();
    new SmoothScroller();
    new PageLoader();
    
    // Detect current page and initialize page-specific features
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || document.location.href;
    
    // HOME PAGE features
    if (currentPage.includes('HOME') || currentPage.includes('index') || document.location.pathname === '/') {
        // Add any home page specific features here
        console.log('Initializing HOME page features');
    }
    
    // ABOUT US PAGE features
    if (currentPage.includes('ABOUT')) {
        // Add any about page specific features here
        console.log('Initializing ABOUT US page features');
    }
    
    // SERVICES PAGE features  
    if (currentPage.includes('SERVICES') || currentPage.includes('PRODUCTS')) {
        // Add any services page specific features here
        console.log('Initializing SERVICES page features');
    }
    
    // OUR TEAM PAGE features
    if (currentPage.includes('TEAM')) {
        console.log('Initializing OUR TEAM page features');
        new TeamInteractions();
        new TeamGallery();
    }
    
   // CONTACT US PAGE features
if (currentPage.includes('CONTACT')) {
    console.log('Initializing CONTACT US page features');
    
    // Initialize form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm && !contactForm.id) {
        contactForm.id = 'contact-form';
    }
    new FormValidator('contact-form');
    
    // Initialize map if Leaflet is available
    if (typeof L !== 'undefined' && document.querySelector('.map-placeholder')) {
        // Add slight delay to ensure map container is rendered
        setTimeout(() => {
            window.pawfectMap = new InteractiveMap();
        }, 100);
    }
}
    
    // Initialize search if search elements exist
    if (document.getElementById('search')) {
        new SearchFeature();
    }
}

// =============================================
// START EVERYTHING WHEN DOM IS LOADED
// =============================================
document.addEventListener('DOMContentLoaded', initializePage);

// =============================================
// UTILITY FUNCTIONS (Available Globally)
// =============================================
const PAWfectUtils = {
    // Format phone number
    formatPhone: (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    
    // Validate email
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Show notification
    showNotification: (message, type = 'info') => {
        NotificationSystem.show(message, type);
    },
    
    // Debounce function for search/resize events
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Make utils available globally
window.PAWfectUtils = PAWfectUtils;