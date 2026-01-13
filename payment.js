// Payment page functionality

// Get order details from URL parameters or localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
    initPaymentForm();
    formatCardInputs();
});

function loadOrderDetails() {
    // Get quantity from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const quantity = urlParams.get('quantity') || localStorage.getItem('orderQuantity') || '100';
    const pricePerToken = 0.45;
    const total = (parseFloat(quantity) * pricePerToken).toFixed(2);
    
    // Update order summary
    document.getElementById('order-quantity').textContent = quantity + ' BHD';
    document.getElementById('order-total').textContent = '$' + total;
    document.getElementById('pay-amount').textContent = total;
    
    // Store for later use
    window.orderData = {
        quantity: quantity,
        total: total
    };
}

function selectPaymentMethod(method) {
    const cardBtn = document.getElementById('card-btn');
    const cryptoBtn = document.getElementById('crypto-btn');
    const cardSection = document.getElementById('card-payment-section');
    const cryptoSection = document.getElementById('crypto-payment-section');
    
    if (method === 'card') {
        cardBtn.classList.add('active');
        cryptoBtn.classList.remove('active');
        cardSection.style.display = 'block';
        cryptoSection.style.display = 'none';
    } else {
        cryptoBtn.classList.add('active');
        cardBtn.classList.remove('active');
        cardSection.style.display = 'none';
        cryptoSection.style.display = 'block';
    }
}

function formatCardInputs() {
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvc = document.getElementById('card-cvc');
    
    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Format expiry date as MM/YY
    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow numbers for CVC
    cardCvc.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

function initPaymentForm() {
    const form = document.getElementById('payment-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            cardholderName: document.getElementById('cardholder-name').value,
            email: document.getElementById('customer-email').value,
            walletAddress: document.getElementById('wallet-address').value,
            cardNumber: document.getElementById('card-number').value.replace(/\s/g, ''),
            expiry: document.getElementById('card-expiry').value,
            cvc: document.getElementById('card-cvc').value,
            zip: document.getElementById('billing-zip').value,
            quantity: window.orderData.quantity,
            total: window.orderData.total
        };
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Process payment
        await processPayment(formData);
    });
}

function validateForm(data) {
    // Validate email
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate wallet address (basic check)
    if (!data.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        showNotification('Please enter a valid Ethereum wallet address (starts with 0x)', 'error');
        return false;
    }
    
    // Validate card number (basic check - 13-19 digits)
    if (!data.cardNumber.match(/^\d{13,19}$/)) {
        showNotification('Please enter a valid card number', 'error');
        return false;
    }
    
    // Validate expiry date
    if (!data.expiry.match(/^\d{2}\/\d{2}$/)) {
        showNotification('Please enter expiry date as MM/YY', 'error');
        return false;
    }
    
    // Check if card is expired
    const [month, year] = data.expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expDate < new Date()) {
        showNotification('Card has expired', 'error');
        return false;
    }
    
    // Validate CVC
    if (!data.cvc.match(/^\d{3,4}$/)) {
        showNotification('Please enter a valid CVV/CVC', 'error');
        return false;
    }
    
    return true;
}

async function processPayment(data) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Processing Payment...';
    
    try {
        showNotification('Processing your payment...', 'success');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In production, send this to your backend server
        // const response = await fetch('/api/process-payment', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         amount: parseFloat(data.total) * 100, // Convert to cents
        //         email: data.email,
        //         walletAddress: data.walletAddress,
        //         quantity: data.quantity,
        //         // Don't send raw card details - use Stripe Elements or similar
        //     })
        // });
        
        // For demo purposes, simulate successful payment
        const orderNumber = 'MTK-' + Date.now();
        
        // Save order info
        const orderInfo = {
            orderNumber: orderNumber,
            email: data.email,
            walletAddress: data.walletAddress,
            quantity: data.quantity,
            total: data.total,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        
        // Store in localStorage
        const orders = JSON.parse(localStorage.getItem('tokenOrders') || '[]');
        orders.push(orderInfo);
        localStorage.setItem('tokenOrders', JSON.stringify(orders));
        
        // Clear order quantity
        localStorage.removeItem('orderQuantity');
        
        // Show success and redirect
        showNotification('✅ Payment successful! Order #' + orderNumber, 'success');
        
        setTimeout(() => {
            // Redirect to confirmation page
            window.location.href = 'payment-success.html?order=' + orderNumber;
        }, 2000);
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment failed. Please try again or contact support.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
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
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
