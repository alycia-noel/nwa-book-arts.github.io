// NWA Book Arts Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeNavigation();
    
    // Load events if we're on the events page
    if (window.location.pathname.includes('events.html') || 
        window.location.pathname.endsWith('events')) {
        loadEventsFromCSV();
    }
    
    // Add smooth scrolling to all internal links
    initializeSmoothScrolling();
    
    // Add loading animation for images
    initializeImageLoading();
});

// Navigation functionality
function initializeNavigation() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.style.backgroundColor = 'var(--color-secondary)';
        }
    });
}

// CSV parsing and event loading
async function loadEventsFromCSV() {
    try {
        const response = await fetch('assets/events.csv');
        const csvText = await response.text();
        const events = parseCSV(csvText);
        
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        // Fallback to static events that are already in the HTML
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const events = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const event = {};
        
        headers.forEach((header, index) => {
            event[header] = values[index] ? values[index].trim() : '';
        });
        
        events.push(event);
    }
    
    return events;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

function displayEvents(events) {
    const upcomingContainer = document.getElementById('upcoming-events');
    const previousContainer = document.getElementById('previous-events');
    
    if (!upcomingContainer || !previousContainer) return;
    
    // Clear existing content
    upcomingContainer.innerHTML = '';
    previousContainer.innerHTML = '';
    
    events.forEach(event => {
        const eventElement = createEventElement(event);
        
        if (event.Upcoming === 'True' || event.Upcoming === true) {
            upcomingContainer.appendChild(eventElement);
        } else {
            previousContainer.appendChild(eventElement);
        }
    });
    
    // Add fallback message if no events
    if (upcomingContainer.children.length === 0) {
        upcomingContainer.innerHTML = '<p class="no-events">No upcoming events at this time.</p>';
    }
    
    if (previousContainer.children.length === 0) {
        previousContainer.innerHTML = '<p class="no-events">No previous events to display.</p>';
    }
}

function createEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    
    eventDiv.innerHTML = `
        <h3 class="event-name">${escapeHtml(event['Event Name'] || '')}</h3>
        <p class="event-date"><strong>Date:</strong> ${escapeHtml(event.Date || '')}</p>
        <p class="event-time"><strong>Time:</strong> ${escapeHtml(event.Time || '')}</p>
        <p class="event-location"><strong>Location:</strong> ${escapeHtml(event.Location || '')}</p>
        <p class="event-description">${escapeHtml(event.Description || '')}</p>
    `;
    
    return eventDiv;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
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

// Image loading with fade-in effect
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in-out';
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });
}

// Form validation and submission helpers
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4444';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        background-color: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add intersection observer for animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.event-item, .about-content, .member-info, .member-links').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScrollAnimations);
} else {
    initializeScrollAnimations();
}