// Settings
const PH_API_BASE = 'https://psgc.gitlab.io/api';
let currentShippingFee = 0; // Default fallback fee

// Grab Elements
const provinceSelect = document.getElementById('province-dropdown');
const citySelect = document.getElementById('city-dropdown');
const checkoutForm = document.getElementById('checkout-form');
const shippingValDisplay = document.getElementById('shipping-val');

// Start Page
document.addEventListener('DOMContentLoaded', () => {
    fetchProvinces();
    loadCartSummary();
});

// 1. Get Provinces from API and attach Region Codes for Shipping
async function fetchProvinces() {
    try {
        const res = await fetch(`${PH_API_BASE}/provinces`);
        const data = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));

        provinceSelect.innerHTML = '<option value="" selected disabled>Select Province</option>';
        data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.code;
            option.textContent = p.name;
            option.dataset.region = p.regionCode; 
            provinceSelect.appendChild(option);
        });
    } catch (err) { 
        console.error("Province error", err); 
    }
}

// 2. Handle Province Change (Update Cities & Shipping Fee)
provinceSelect.addEventListener('change', async function() {
    const regionCode = this.options[this.selectedIndex].dataset.region;
    calculateDynamicShipping(regionCode);
    
    citySelect.disabled = false;
    citySelect.innerHTML = '<option disabled>Loading...</option>';

    try {
        const res = await fetch(`${PH_API_BASE}/provinces/${this.value}/cities-municipalities`);
        const data = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));

        citySelect.innerHTML = '<option value="" selected disabled>Select City</option>';
        data.forEach(c => {
            citySelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        });
    } catch (err) { 
        console.error("City error", err); 
    }
});

// 3. Shipping Fee Logic (Origin: CDO/Mindanao)
function calculateDynamicShipping(regionCode) {
    const mindanaoRegions = ["09", "10", "11", "12", "13", "19"];
    const visayasRegions = ["06", "07", "08"];
    
    if (mindanaoRegions.includes(regionCode)) {
        currentShippingFee = 85; 
    } else if (visayasRegions.includes(regionCode)) {
        currentShippingFee = 110;
    } else if (regionCode === "17") {
        currentShippingFee = 150;
    } else {
        currentShippingFee = 125;
    }

    // After updating the fee, we refresh the summary to apply it
    loadCartSummary(); 
}

// 4. Display Items from LocalStorage
function loadCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('summary-items');
    let subtotal = 0;

    container.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No items in cart.</p>';
        // If empty, set everything to 0 and stop calculation
        document.getElementById('subtotal-val').textContent = `₱0.00`;
        shippingValDisplay.textContent = `₱0.00`;
        document.getElementById('final-total').textContent = `₱0.00`;
        return; 
    }

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        container.innerHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name} (x${item.quantity})</span>
                <span>₱${(item.price * item.quantity).toLocaleString()}</span>
            </div>`;
    });

    const grandTotal = subtotal + currentShippingFee;

    document.getElementById('subtotal-val').textContent = `₱${subtotal.toLocaleString()}`;
    shippingValDisplay.textContent = `₱${currentShippingFee.toFixed(2)}`; // Update display here
    document.getElementById('final-total').textContent = `₱${grandTotal.toLocaleString()}`;
}

// 5. Secure Form Submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }

    const fName = document.getElementById('custf-name').value.trim();
    const lName = document.getElementById('custl-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const zipCode = document.querySelector('input[placeholder="4 Digit Code"]').value.trim();

    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
        alert("Invalid, please enter a valid name");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Invalid, please enter a valid email address.");
        return;
    }

    if (!/^\d{11}$/.test(phone)) {
        alert("Invalid phone number, please try again.");
        return;
    }

    if (!/^\d{4}$/.test(zipCode)) {
        alert("Invalid ZIP Code, please enter 4 digits.");
        return;
    }

    alert(`Thank you, ${fName}! Your order has been placed.\nTotal: ${document.getElementById('final-total').textContent}`);
});
