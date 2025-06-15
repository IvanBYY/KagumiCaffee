document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const categoryBoxes = document.querySelectorAll('.category-box');
    const productBoxes = document.querySelectorAll('.product-box');
    const viewAllText = document.getElementById('view-all-text');
    const customerNameInput = document.getElementById('customer-name');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();

    // Toggle sidebar
    cartBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        renderCartItems();
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productBox = button.closest('.product-box');
            
            // Cara yang lebih aman untuk mendapatkan ID produk
            const productElement = Alpine.$data(productBox);
            const productId = productElement?.product?.id || Date.now(); // Fallback ke timestamp jika ID tidak ditemukan
            
            const productName = productBox.querySelector('h3').textContent;
            const productPrice = parsePrice(productBox.querySelector('.price').textContent);
            const productImage = productBox.querySelector('img').src;

            addToCart({ 
                id: productId, 
                name: productName, 
                price: productPrice, 
                image: productImage 
            });
        });
    });

    // Cart functions
// In the addToCart function, modify to ensure proper ID handling
function addToCart(product) {
    // Ensure product has a valid ID
    if (!product.id) {
        product.id = Date.now(); // Fallback ID if not provided
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    cartCount += 1;
    updateCartState();
}

// Modify the renderCartItems function to properly handle event listeners
function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyTemplate = document.getElementById('empty-cart-template');
        const emptyMessage = emptyTemplate.content.cloneNode(true);
        cartItemsContainer.appendChild(emptyMessage);
        cartTotalElement.textContent = 'Rp. 0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const template = document.getElementById('cart-item-template');
        const cartItemElement = template.content.cloneNode(true);
        const cartItemDiv = cartItemElement.querySelector('.cart-item');

        cartItemDiv.querySelector('.cart-item-image img').src = item.image;
        cartItemDiv.querySelector('.cart-item-image img').alt = item.name;
        cartItemDiv.querySelector('.cart-item-info h4').textContent = item.name;
        cartItemDiv.querySelector('.cart-item-price').textContent = `Rp. ${formatPrice(item.price)}`;
        cartItemDiv.querySelector('.item-quantity').textContent = item.quantity;
        
        // Set data attributes properly
        cartItemDiv.querySelector('.remove-item').dataset.id = item.id;
        cartItemDiv.querySelector('.add-item').dataset.id = item.id;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = `Rp. ${formatPrice(total)}`;
    
    // Always set up event listeners after rendering
    setupCartItemEventListeners();
}

// Improve the setupCartItemEventListeners function
function setupCartItemEventListeners() {
    // Remove any existing event listeners first to prevent duplicates
    // Setup fresh event listeners for new elements
document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromCart(button.dataset.id);
    });
});

document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = button.dataset.id;
        const product = cart.find(item => item.id == productId); // gunakan == agar bisa cocokkan string dan number
        if (product) {
            addToCart({ 
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
    });
});


    document.querySelectorAll('.add-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const productId = button.dataset.id;
            const product = cart.find(item => item.id === productId);
            if (product) {
                // Create a clean product object without quantity
                const productToAdd = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                };
                addToCart(productToAdd);
            }
        });
    });
}
    function removeFromCart(id) {
    const item = cart.find(item => item.id == id);
    if (item) {
        item.quantity -= 1;
        cartCount -= 1;
        if (item.quantity <= 0) {
            const index = cart.findIndex(i => i.id == id);
            cart.splice(index, 1);
        }
        updateCartState();
    }
}

    function updateCartState() {
        updateCartCount();
        saveCartToLocalStorage();
        renderCartItems();
        checkoutBtn.disabled = customerNameInput.value.trim() === '' || cart.length === 0;
    }

    function updateCartCount() {
        let cartCountElement = document.querySelector('.cart-count');

        if (cartCount > 0) {
            if (!cartCountElement) {
                cartCountElement = document.createElement('span');
                cartCountElement.className = 'cart-count';
                cartBtn.appendChild(cartCountElement);
            }
            cartCountElement.textContent = cartCount;
        } else if (cartCountElement) {
            cartCountElement.remove();
        }
    }  

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Checkout handler
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const customerName = customerNameInput.value.trim();
    if (!customerName) {
        alert('Harap masukkan nama Anda!');
        return;
    }

    // Simpan nama customer untuk halaman pembayaran
    localStorage.setItem('customer_name', customerName);
    
    // Redirect ke halaman pembayaran
    window.location.href = 'payment.html';
});

    // Customer name validation
    customerNameInput.addEventListener('input', () => {
        checkoutBtn.disabled = customerNameInput.value.trim() === '' || cart.length === 0;
    });

    // Category filtering
    viewAllText.textContent = 'All';

    categoryBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            e.preventDefault();
            categoryBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');

            const selectedCategory = box.dataset.category;
            productBoxes.forEach(product => {
                product.style.display = selectedCategory === 'all' || selectedCategory === product.dataset.category ? 'block' : 'none';
            });

            viewAllText.textContent = box.querySelector('span').textContent;
        });
    });

    document.querySelector('.category-box[data-category="all"]').classList.add('active');

    // Helper functions
    function parsePrice(priceStr) {
        return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    }

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
});