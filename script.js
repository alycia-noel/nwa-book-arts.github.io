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
    
    // Separate upcoming and previous events
    const upcomingEvents = events.filter(event => event.Upcoming === 'True' || event.Upcoming === true);
    const previousEvents = events.filter(event => event.Upcoming === 'False' || event.Upcoming === false);
    
    // Display upcoming events normally
    upcomingEvents.forEach(event => {
        const eventElement = createEventElement(event);
        upcomingContainer.appendChild(eventElement);
    });
    
    // Organize previous events by month/year
    displayPreviousEvents(previousEvents, previousContainer);
    
    // Add fallback message if no events
    if (upcomingContainer.children.length === 0) {
        upcomingContainer.innerHTML = '<p class="no-events">No upcoming events at this time.</p>';
    }
    
    if (previousContainer.children.length === 0) {
        previousContainer.innerHTML = '<p class="no-events">No previous events to display.</p>';
    }
}

function displayPreviousEvents(events, container) {
    // Sort events chronologically (newest first)
    const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.Date || '1900-01-01');
        const dateB = new Date(b.Date || '1900-01-01');
        return dateB - dateA;
    });
    
    // Create a single event list
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';
    
    sortedEvents.forEach(event => {
        const listItem = document.createElement('li');
        listItem.className = 'event-bullet';
        
        const eventLink = document.createElement('a');
        eventLink.className = 'event-link';
        eventLink.href = `events/${createEventSlug(event['Event Name'])}.html`;
        
        // Format as 'Date - Event Name'
        const dateStr = formatEventDate(event.Date) || 'TBA';
        const eventName = event['Event Name'] || 'Untitled Event';
        eventLink.textContent = `${dateStr} - ${eventName}`;
        
        listItem.appendChild(eventLink);
        eventList.appendChild(listItem);
    });
    
    container.appendChild(eventList);
}

function extractMonthYear(dateStr) {
    // Try to parse different date formats and extract month/year
    const date = new Date(dateStr);
    
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Fallback for non-standard formats
    if (dateStr.includes('2025')) return 'November 2025';
    if (dateStr.includes('2026')) return 'February 2026';
    
    return 'Unknown Date';
}

function createEventSlug(eventName) {
    return eventName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

function formatEventDate(dateStr) {
    if (!dateStr || dateStr === 'TBA') return dateStr;
    
    // Try to parse the date
    const date = new Date(dateStr);
    
    // If it's a valid date, format it as "Month Day, Year"
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    
    // For partial dates like "December 2025" or "February 2026"
    if (dateStr.includes('2025') || dateStr.includes('2026')) {
        // Handle cases like "December 2025"
        const parts = dateStr.trim().split(' ');
        if (parts.length === 2) {
            const month = parts[0];
            const year = parts[1];
            return `${month} ${year}`;
        }
        
        // Handle cases like "September 6 2025" (add comma)
        if (parts.length === 3) {
            const month = parts[0];
            const day = parts[1];
            const year = parts[2];
            return `${month} ${day}, ${year}`;
        }
    }
    
    // Return original if we can't format it
    return dateStr;
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

// Carousel functionality
let currentSlideIndex = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const slides = track?.children;
    
    if (!slides || slides.length === 0) return;
    
    currentSlideIndex += direction;
    
    // Loop around if at the ends
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    updateCarousel();
}

function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber - 1; // Convert to 0-based index
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!track) return;
    
    // Move the track
    const translateX = -currentSlideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Auto-advance carousel (optional)
function startCarouselAutoplay() {
    setInterval(() => {
        const track = document.getElementById('carousel-track');
        if (track && track.children.length > 0) {
            moveCarousel(1);
        }
    }, 5000); // Change slide every 5 seconds
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize carousel if it exists on the page
    const carousel = document.getElementById('carousel-track');
    if (carousel) {
        updateCarousel(); // Set initial state
        // Uncomment the next line if you want auto-play
        // startCarouselAutoplay();
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('carousel-track')) return;
        
        if (e.key === 'ArrowLeft') {
            moveCarousel(-1);
        } else if (e.key === 'ArrowRight') {
            moveCarousel(1);
        }
    });
});