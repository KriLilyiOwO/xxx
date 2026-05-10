// --- DYNAMIC DATABASE SYNC ---
const defaultProducts = [
    { id: 1, name: "Tokyo Sakura Date Night Kit", price: 1890, image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800" },
    { id: 2, name: "Busan K-Drama Comfort Box", price: 1650, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800" },
    { id: 3, name: "Tokyo Anime Movie Night Kit", price: 2100, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800" },
    { id: 4, name: "Busan Korean BBQ Home Kit", price: 2450, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800" },
    { id: 5, name: "Tokyo Harajuku Sweet Treat Box", price: 1450, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800" },
    { id: 6, name: "Busan Beach Picnic Kit", price: 1750, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800" }
];

// Check if localStorage has data, otherwise use defaults
let products = JSON.parse(localStorage.getItem("storedProducts")) || defaultProducts;

// If it's the first time ever loading, save the defaults to localStorage
if (!localStorage.getItem("storedProducts")) {
    localStorage.setItem("storedProducts", JSON.stringify(products));
}

const productList = document.getElementById("product-list"); 

// --- SHOP PAGE LOGIC ---
if(productList) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser && currentUser.role === "admin";

  productList.innerHTML = '';

  products.forEach(p => {
    let buttonHTML = isAdmin 
        ? `<a href="admin.html" class="btn btn-outline-dark mt-auto">Edit in Admin</a>`
        : `<button class="btn btn-checkout mt-auto" onclick="addToCart(${p.id})">Add to Cart</button>`;

    productList.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 border-0 shadow-sm" style="border-radius: 15px; overflow: hidden;">
          <img src="${p.image}" class="card-img-top" style="height:250px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="fw-bold product-name">${p.name}</h5>
            <p class="text-muted">₱${p.price.toLocaleString()}</p>
            ${buttonHTML}
          </div>
        </div>
      </div>`;
  });
}

// --- ADD TO CART LOGIC ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);

  if(existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
  
  if (document.getElementById('cart-items-list')) {
    renderCart();
  }
}

// --- CART PAGE LOGIC ---
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-list');
    let subtotal = 0;

    if (!container) return; 

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><p class="text-muted">Your cart is empty.</p></div>';
        updateTotals(0);
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        container.innerHTML += `
        <div class="row align-items-center mb-4 cart-item">
            <div class="col-5 d-flex align-items-center">
                <img src="${item.image}" class="cart-product-img me-3" style="width: 70px; height: 70px; object-fit: cover; border-radius: 10px;">
                <div>
                    <h6 class="mb-0 fw-bold product-name">${item.name}</h6>
                    <small class="text-muted">₱${item.price.toLocaleString()}</small>
                </div>
            </div>
            <div class="col-2 text-center fw-bold">₱${item.price.toLocaleString()}</div>
            <div class="col-3 d-flex justify-content-center">
                <div class="qty-control d-flex align-items-center border rounded">
                    <button class="btn btn-sm" onclick="changeQty(${index}, -1)">-</button>
                    <input type="text" value="${item.quantity}" class="form-control form-control-sm text-center border-0 bg-transparent" style="width: 40px;" readonly>
                    <button class="btn btn-sm" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
            <div class="col-2 text-end d-flex align-items-center justify-content-end">
                <span class="text-success fw-bold me-3">₱${itemTotal.toLocaleString()}</span>
                <button class="btn btn-link text-danger p-0" onclick="removeItem(${index})">
                    <i class="bi bi-trash3-fill h5"></i>
                </button>
            </div>
        </div>`;
    });

    updateTotals(subtotal);
}

function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function updateTotals(subtotal) {
    const shipping = subtotal > 0 ? 100 : 0; 
    
    if(document.getElementById('cart-subtotal')) {
        document.getElementById('cart-subtotal').textContent = `₱${subtotal.toLocaleString()}`;
        document.getElementById('cart-shipping').textContent = `₱${shipping.toLocaleString()}`;
        document.getElementById('cart-total').textContent = `₱${(subtotal + shipping).toLocaleString()}`;
    }
}

document.addEventListener('DOMContentLoaded', renderCart);
