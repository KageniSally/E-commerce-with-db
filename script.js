const cartButton = document.getElementById('cartButton');
const closeCartButton = document.getElementById('closeCartButton');
const cart = document.getElementById('cart');
const productsContainer = document.querySelector('.products-container');
const contentContainer = document.querySelector('.content-container');

// Add Product
const openAddProductButton = document.getElementById('addProduct');
const closeAddProductButton = document.getElementById('closeAddProductForm');
const formAddProduct = document.getElementById('addProductForm');

// Add products and display
const addProductButton = document.getElementById("addProductSubmit");
const productContainer = document.querySelector(".products-container");

// Function to open the cart and adjust product layout
function openCart() {
    cart.classList.add('open');
    productsContainer.classList.add('two-columns');
    contentContainer.classList.add('shrink');
}

// Function to close the cart and adjust product layout
function closeCart() {
    cart.classList.remove('open');
    productsContainer.classList.remove('two-columns');
    contentContainer.classList.remove('shrink');
}

// Event listeners to open/close the cart
cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);

// Event listeners for opening/closing addProductForm
openAddProductButton.addEventListener('click', openAddProduct);
closeAddProductButton.addEventListener('click', closeAddProduct);

function openAddProduct() {
    formAddProduct.parentElement.style.display = 'block';
    formAddProduct.style.display = 'block';
}

function closeAddProduct(e) {
    e.preventDefault();
    formAddProduct.parentElement.style.display = 'none';
    formAddProduct.style.display = 'none';
}

const baseURLProducts = "http://localhost:3000/products/";
const baseURLCart = "http://localhost:3000/cart/";
const baseURLUsers = "http://localhost:3000/users/";
const baseURLOrders = "http://localhost:3000/orders/";

// Get products and display them
function getProducts() {
    fetch(baseURLProducts)
        .then(response => response.json())
        .then(data => displayUI(data))
        .catch(error => console.error('Error fetching products:', error));
}

getProducts();

async function displayUI(data) {
    const username = sessionStorage.getItem("username");
    if (!username) {
        console.error("No username found in session storage.");
        return;
    }

    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user) {
        console.error("User not found.");
        return;
    }

    let html = "";

    if (data.length === 0) {
        html = `<p>No products yet</p>`;
    } else {
        data.forEach(product => {
            html += `
            <div class="product">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-details">
                    <div>
                        <h4>${product.title}</h4>
                    </div>
                    <div>
                        <p>Price: Ksh ${product.price}</p>
                        <p><i>${product.quantity} pieces in stock</i></p>
                        <div class="icons-product">
                        <ion-icon class="icon-product" name="pencil-outline" onclick="updateProducts('${product.id}')"></ion-icon>
                        <ion-icon class="icon-product" name="trash-outline" onclick="deleteProducts('${product.id}')"></ion-icon></div>
                        <button onclick="createCartProduct('${product.id}', '${product.title}', '${product.price}', '${product.quantity}', '${product.image}', '${user.username}')">Add to cart</button>
                    </div>
                </div>
            </div>`;
        });
    }

    productsContainer.innerHTML = html;
}

// Add a new product
addProductButton.addEventListener('click', createProduct);

async function createProduct(e) {
    e.preventDefault();

    const username = sessionStorage.getItem("username");
    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to add products.");
        return;
    }

    let newProduct = {
        title: title.value,
        price: price.value,
        quantity: quantity.value,
        image: image.value
    };

    if (addProductButton.textContent === 'Add') {
        await fetch(baseURLProducts, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
    }

    getProducts();
}

// Prepopulate form for update
function prepopulate(product) {
    title.value = product.title;
    price.value = product.price;
    quantity.value = product.quantity;
    image.value = product.image;
    addProductButton.textContent = 'Update';
}

// Update an existing product
async function updateProducts(id) {
    const username = sessionStorage.getItem("username");
    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to update a product.");
        return;
    }

    const productResponse = await fetch(baseURLProducts + id);
    const product = await productResponse.json();

    if (product) {
        prepopulate(product);
        addProductButton.addEventListener('click', async () => {
            if (addProductButton.textContent === "Update") {
                let updatedProduct = {
                    title: title.value,
                    price: price.value,
                    quantity: quantity.value,
                    image: image.value
                };

                await fetch(baseURLProducts + id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedProduct)
                });

                getProducts();
            }
        });
    }
}

// Delete a product
async function deleteProducts(id) {
    const username = sessionStorage.getItem("username");
    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to delete a product.");
        return;
    }

    await fetch(baseURLProducts + id, {
        method: "DELETE"
    });

    getProducts();
}

// Create a cart product
async function createCartProduct(productId, productTitle, productPrice, productQuantity, productImage, userName) {
    const username = sessionStorage.getItem("username");
    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'customer') {
        alert("You must be logged in as a customer to add a product to the cart.");
        return;
    }

    const cartResponse = await fetch(baseURLCart);
    const cartProducts = await cartResponse.json();

    let existingProduct = cartProducts.find(product => product.id === productId);

    if (existingProduct) {
        existingProduct.quantity = parseInt(existingProduct.quantity) + 1;
        await fetch(baseURLCart + existingProduct.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(existingProduct)
        });
    } else {
        let newCartProduct = {
            id: productId,
            title: productTitle,
            price: productPrice,
            quantity: 1,
            username: userName,
            quantityInStock: productQuantity,
            image: productImage
        };

        await fetch(baseURLCart, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCartProduct)
        });
    }

    getCartProducts();
}

function getCartProducts() {
    fetch(baseURLCart)
        .then(response => response.json())
        .then(data => displayCartUI(data))
        .catch(error => console.error('Error fetching cart products:', error));
}

getCartProducts();

// Delete cart product
async function removeCartProduct(id) {
    await fetch(baseURLCart + id, {
        method: "DELETE"
    });

    getCartProducts();
}

// Display cart UI
const cartContentDiv = document.querySelector('.cart-content');

async function displayCartUI(cartProducts) {
    const username = sessionStorage.getItem("username");
    if (!username) {
        cartContentDiv.innerHTML = "<p>No user logged in</p>";
        return;
    }

    const userCartProducts = cartProducts.filter(cart => cart.username === username);

    let cp = "";
    if (userCartProducts.length === 0) {
        cp = `<p>No products in cart</p>`;
    } else {
        userCartProducts.forEach((cartProduct, index) => {
            cp += `
            <div class="cart-product">
                <div class="cart-product-image">
                    <img src="${cartProduct.image}" alt="">
                </div>
                <div class="cart-product-details">
                    <div>
                        <h4>${cartProduct.title}</h4>
                    </div>
                    <div>
                        <p>Price: ${cartProduct.price} Ksh</p>
                        <div class="quantity-div">
                            <input type="number" class="quantity" value="${cartProduct.quantity}" min="1" oninput="calculateSubtotal(${index}, '${cartProduct.price}', this.value, '${cartProduct.quantityInStock}')">
                        </div>
                        <p class="subTotal" id="subtotal-${index}">Total: ${calculateInitialSubtotal(cartProduct.price, cartProduct.quantity)} Ksh</p>
                        <button onclick="removeCartProduct('${cartProduct.id}')">Remove</button>
                    </div>
                </div>
            </div>`;
        });
    }

    cartContentDiv.innerHTML = cp;
    calculateGrandTotal();
}

// Calculate the initial subtotal
function calculateInitialSubtotal(price, quantity) {
    const priceNumber = parseFloat(price.replace(/,/g, ''));
    return priceNumber * quantity;
}

// Calculate subtotal and update grand total
function calculateSubtotal(index, price, quantity, quantityInStock) {
    const priceNumber = parseFloat(price.replace(/,/g, ''));
    const availableQuantity = parseInt(quantityInStock);
    const requestedQuantity = parseInt(quantity);

    if (requestedQuantity > availableQuantity) {
        window.alert("Quantities not available in stock");
    } else {
        const subtotal = priceNumber * requestedQuantity;
        document.getElementById(`subtotal-${index}`).innerText = `Total: ${subtotal} Ksh`;
        calculateGrandTotal();
    }
}

// Calculate the grand total
async function calculateGrandTotal() {
    const response = await fetch(baseURLCart);
    const cartProducts = await response.json();
    const username = sessionStorage.getItem("username");
    const userCartProducts = cartProducts.filter(cart => cart.username === username);

    let grandTotal = 0;
    userCartProducts.forEach((cartProduct, index) => {
        let subtotalElement = document.querySelector(`#subtotal-${index}`);
        let subtotalValue = parseFloat(subtotalElement.innerText.split(':')[1].trim().replace(/,/g, ''));
        grandTotal += isNaN(subtotalValue) ? 0 : subtotalValue;
    });

    document.querySelector('.grand-total').innerHTML = `
        <h4 class="totalPrice">Total Price: Ksh ${grandTotal.toFixed(2)}</h4>
        <button class="checkout" onclick="checkout('${grandTotal.toFixed(2)}')">Checkout</button>
    `;
}


//Function for current date
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}
// Checkout function to handle placing an order
async function checkout(grandTotal) {
    const username = sessionStorage.getItem("username");
    if (!username) {
        alert("You need to be logged in to checkout.");
        return;
    }

    const usersResponse = await fetch(baseURLUsers);
    const users = await usersResponse.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'customer') {
        alert("You must be logged in as a customer to checkout.");
        return;
    }

    const cartResponse = await fetch(baseURLCart);
    const cartProducts = await cartResponse.json();
    const userCartProducts = cartProducts.filter(cart => cart.username === username);

    if (userCartProducts.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Create a new order
    const newOrder = {
        username: user.username,
        total: grandTotal,
        products: userCartProducts,
        date: getCurrentDate()
    };

    await fetch(baseURLOrders, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    });

    // Clear the cart after placing the order
    await Promise.all(userCartProducts.map(async product => {
        await fetch(`${baseURLCart}${product.id}`, {
            method: "DELETE"
        });
    }));

    alert("Order placed successfully!");

    getCartProducts();
}

// Event listener to calculate the grand total on page load
document.addEventListener("DOMContentLoaded", function () {
    calculateGrandTotal();
});


const orders = document.querySelector(".orders");
orders.addEventListener('click', checkUserStatus);

// Function to check user status
async function checkUserStatus(event) {
    event.preventDefault();

    const username = sessionStorage.getItem("username");
    if (!username) {
        alert("You need to be logged in to view this page.");
        return;
    }

    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'admin') {
        alert("Only admins can view this page.");
        return;
    }


    window.location.href = "orders.html";
}
document.addEventListener("DOMContentLoaded", function () {
    const username = sessionStorage.getItem("username");
    if (username) {
        document.querySelector(".username").textContent = username;
    } else {
        console.error("No username found in session storage.");
    }
});
