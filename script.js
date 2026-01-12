/* ===================================
   CRYPTOCURRENCY WEBSITE JAVASCRIPT
   Interactions & Animations
   ==================================== */

// ===== NAVIGATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initFAQ();
  initSmoothScroll();
  initFormHandling();
  updatePriceTicker();
  updateActiveNav();
  initScrollAnimations();
});

// Navigation Toggle
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = event.target.closest('nav');
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// Update Active Navigation Link
function updateActiveNav() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Smooth Scroll
function initSmoothScroll() {
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

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// ===== FORM HANDLING =====
function initFormHandling() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.btn-primary');
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: this.querySelector('[name="name"]')?.value,
        email: this.querySelector('[name="email"]')?.value,
        subject: this.querySelector('[name="subject"]')?.value,
        message: this.querySelector('[name="message"]')?.value
      };

      // Validate
      if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      // Email validation
      if (!isValidEmail(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // Show success (in production, send to server)
      showNotification('Thank you! We will get back to you soon.', 'success');
      this.reset();
    });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 110, 0.1)'};
    border: 1px solid ${type === 'success' ? '#00ff88' : '#ff006e'};
    color: ${type === 'success' ? '#00ff88' : '#ff006e'};
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== PRICE TICKER UPDATE =====
function updatePriceTicker() {
  // Simulated price data - Replace with real API calls
  const priceData = [
    { label: 'Current Price', value: '$0.45', change: '+12.5%', positive: true },
    { label: '24h High', value: '$0.52', change: '+8.2%', positive: true },
    { label: '24h Low', value: '$0.38', change: '-5.1%', positive: false },
    { label: 'Market Cap', value: '$450M', change: '+15.3%', positive: true }
  ];

  const priceTicker = document.querySelector('.price-ticker');
  if (priceTicker) {
    priceTicker.innerHTML = priceData.map(item => `
      <div class="price-item">
        <div class="price-label">${item.label}</div>
        <div class="price-value">${item.value}</div>
        <div class="price-change ${item.positive ? 'positive' : 'negative'}">
          ${item.positive ? '↗' : '↘'} ${item.change}
        </div>
      </div>
    `).join('');
  }

  // Update every 30 seconds (simulated)
  setInterval(() => {
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach((item, index) => {
      const valueEl = item.querySelector('.price-value');
      const changeEl = item.querySelector('.price-change');
      
      // Simulate random price changes
      const randomChange = (Math.random() - 0.5) * 0.1;
      if (valueEl) {
        valueEl.style.animation = 'slideInUp 0.3s ease';
        setTimeout(() => {
          valueEl.style.animation = 'none';
        }, 300);
      }
    });
  }, 30000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.card, .highlight-card, .team-card, .roadmap-card').forEach(el => {
    observer.observe(el);
  });
}

// ===== WALLET CONNECTION SIMULATION =====
function connectWallet() {
  showNotification('Wallet connection feature coming soon!', 'success');
}

// ===== BUY COIN HANDLER =====
function buyNow() {
  const quantity = document.querySelector('[name="quantity"]')?.value;
  if (quantity && quantity > 0) {
    showNotification(`Processing purchase of ${quantity} coins...`, 'success');
    // In production, integrate with actual payment gateway
  } else {
    showNotification('Please enter a valid quantity', 'error');
  }
}

// ===== DYNAMIC PRICE CALCULATION =====
function calculateTotal() {
  const quantity = document.querySelector('[name="quantity"]')?.value || 0;
  const pricePerCoin = 0.45;
  const total = (quantity * pricePerCoin).toFixed(2);
  const totalEl = document.querySelector('.total-price');
  if (totalEl) {
    totalEl.textContent = `$${total}`;
  }
}

// ===== CHART INITIALIZATION (Pie Chart Simulation) =====
function initChart() {
  const canvas = document.getElementById('tokenomics-chart');
  if (canvas && typeof CanvasRenderingContext2D !== 'undefined') {
    const ctx = canvas.getContext('2d');
    drawPieChart(ctx);
  }
}

function drawPieChart(ctx) {
  const canvas = ctx.canvas;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;

  const data = [
    { label: 'Team', value: 20, color: '#00d4ff' },
    { label: 'Liquidity', value: 30, color: '#b020f0' },
    { label: 'Marketing', value: 25, color: '#ff006e' },
    { label: 'Community', value: 25, color: '#00ff88' }
  ];

  let currentAngle = -Math.PI / 2;

  data.forEach(segment => {
    const sliceAngle = (segment.value / 100) * 2 * Math.PI;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(segment.value + '%', labelX, labelY);

    currentAngle += sliceAngle;
  });
}

// ===== DOWNLOAD WHITEPAPER =====
function downloadWhitepaper() {
  showNotification('Whitepaper download initiated!', 'success');
  // In production, provide actual whitepaper PDF download
  // window.location.href = '/whitepaper.pdf';
}

// ===== COPY WALLET ADDRESS =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy', 'error');
  });
}

// ===== DARK MODE TOGGLE (Optional) =====
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', function() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  parallaxElements.forEach(element => {
    const speed = element.dataset.parallax || 0.5;
    element.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }
}

initScrollProgress();

// ===== TYPEWRITER EFFECT =====
function typewriter(element, text, speed = 50) {
  element.textContent = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  function count() {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(count);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  count();
}
