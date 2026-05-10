const products = [
  {
    id: 1,
    name: "Tokyo Sakura Date Night Kit",
    price: 1890,
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800"
  },
  {
    id: 2,
    name: "Busan K-Drama Comfort Box",
    price: 1650,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"
  },
  {
    id: 3,
    name: "Tokyo Anime Movie Night Kit",
    price: 2100,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800"
  },
  {
    id: 4,
    name: "Busan Korean BBQ Home Kit",
    price: 2450,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
  },
  {
    id: 5,
    name: "Tokyo Harajuku Sweet Treat Box",
    price: 1450,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800"
  },
  {
    id: 6,
    name: "Busan Beach Picnic Kit",
    price: 1750,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800"
  }
];

const productList = document.getElementById("product-list");

if (productList) {

  products.forEach(product => {

    productList.innerHTML += `
      <div class="col-md-4 mb-4">

        <div class="card h-100 border-0 shadow-sm"
          style="border-radius: 15px; overflow: hidden;">

          <img
            src="${product.image}"
            class="card-img-top"
            style="height:250px; object-fit:cover;"
          >

          <div class="card-body d-flex flex-column">

            <h5 class="fw-bold product-name">
              ${product.name}
            </h5>

            <p class="text-muted">
              ₱${product.price.toLocaleString()}
            </p>

            <button
              class="btn btn-checkout mt-auto"
              onclick="addToCart(${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    `;
  });
}

function addToCart(id) {

  const product = products.find(p => p.id === id);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === id);

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${product.name} added to cart!`);
}

