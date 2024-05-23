const cartButton = document.getElementById('cartButton')
const closeCartButton = document.getElementById('closeCartButton')
const cart = document.getElementById('cart')
const productsContainer = document.querySelector('.products-container')
const contentContainer = document.querySelector('.content-container')

// Add Product
const openAddProductButton = document.getElementById('addProduct')
const closeAddProductButton = document.getElementById('closeAddProductForm')
const formAddProduct = document.getElementById('addProductForm')


// Add products and display
const addProductButton = document.getElementById("addProductSubmit")
const productContainer = document.querySelector(".products-container")

// Function to open the cart and adjust product layout
function openCart() {
    cart.classList.add('open')
    productsContainer.classList.add('two-columns')
    contentContainer.classList.add('shrink')
}

// Function to close the cart and adjust product layout
function closeCart() {
    cart.classList.remove('open')
    productsContainer.classList.remove('two-columns')
    contentContainer.classList.remove('shrink')
}

// Event listener to open the cart when clicking the button
cartButton.addEventListener('click', openCart)

// Event listener to close the cart when clicking the close button
closeCartButton.addEventListener('click', closeCart)

// Event listener for opening addProductForm
openAddProductButton.addEventListener('click', openAddProduct)
closeAddProductButton.addEventListener('click', closeAddProduct)

function openAddProduct() {
    formAddProduct.parentElement.style.display = 'block'
    formAddProduct.style.display = 'block'
}

function closeAddProduct(e) {
    e.preventDefault()
    formAddProduct.parentElement.style.display = 'none'
    formAddProduct.style.display = 'none'
}


const baseURLProducts = "http://localhost:3000/products/";
const baseURLCart = "http://localhost:3000/cart/";
const baseURLUsers = "http://localhost:3000/users/"


function getProducts() {
    fetch(baseURLProducts)
        .then(response => response.json())
        .then(data => {
            displayUI(data);
        });
}

getProducts();

const productsDiv = document.querySelector(".products-container")

function displayUI(data) {
    let html = ""

    if (data.length === 0) {
        html = `<p>No products yet</p>`
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
                        <button onclick="createCartProduct('${product.id}', '${product.title}', '${product.price}', '${product.quantity}', '${product.image}')">Add to cart</button>
                    </div>
                </div>
            </div>`
        })
    }

    productsDiv.innerHTML = html
}



//create a product
const btn = document.getElementById('addProductSubmit')
const title = document.getElementById('product-title')
const price = document.getElementById('product-price')
const quantity = document.getElementById('product-quantity')
const image = document.getElementById('image-url')
btn.addEventListener('click', createProduct)
async function createProduct(e) {
    e.preventDefault()

    const username = sessionStorage.getItem("username")
    const response = await fetch(baseURLUsers)
    const users = await response.json()
    const user = users.find(user => user.username === username)

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to add products.")
        return
    }

    let newProduct = {
        title: title.value,
        price: price.value,
        quantity: quantity.value,
        image: image.value
    };

    if (btn.textContent === 'Add') {
        // Send a request to create a new product
        await fetch(baseURLProducts, {
            method: "POST",
            body: JSON.stringify(newProduct)
        })
    }
    getProducts()
}


function prepopulate(product) {
    title.value = product.title
    price.value = product.price
    quantity.value = product.quantity
    image.value = product.image
    btn.textContent = 'Update'
}
//update function
async function updateProducts(id) {
    const username = sessionStorage.getItem("username");
    const response1 = await fetch(baseURLUsers);
    const users = await response1.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to update a product.");
        return;
    }
    let response2 = await fetch(baseURLProducts + id)
    let product = await response2.json()
    if (product) {
        //prepopulate
        prepopulate(product)
        btn.addEventListener('click', () => {
            if (btn.textContent === "Update") {
                let updatedProduct = {
                    title: title.value,
                    price: price.value,
                    quantity: quantity.value,
                    image: image.value,
                    id
                }

                sendRequest(updatedProduct)
            }
            console.log("updatedProduct")

        })
    }
}
async function sendRequest({ id, ...updatedProduct }) {
    console.log("updated product id" + id)
    await fetch(baseURLProducts + id, {
        method: "PUT",
        body: JSON.stringify(updatedProduct)
    })
    getProducts()
}




//delete
async function deleteProducts(id) {
    const username = sessionStorage.getItem("username")
    const response = await fetch(baseURLUsers)
    const users = await response.json();
    const user = users.find(user => user.username === username)

    if (!user || user.role !== 'admin') {
        alert("You must be logged in as an admin to delete a product.")
        return;
    }
    await fetch(baseURLProducts + id, {
        method: "DELETE"
    })
    getProducts()
}



// //create cart product
// async function createCartProduct(productId, productTitle, productPrice, productQuantity, productImage) {
//     //check the role of the user so that can see if he can manipulate cart items
//     const username = sessionStorage.getItem("username")
//     const response = await fetch(baseURLUsers)
//     const users = await response.json()
//     const user = users.find(user => user.username === username)
//     if (!user || user.role !== 'customer') {
//         alert("You must be logged in as an customer to add product to cart .")
//         return;
//     }
//     //check if product is present in cart
//     const response1 = await fetch(baseURLCart)
//     const cartProducts = await response1.json()
//     const existingProduct = cartProducts.find(product => product.id === id)
//     if (existingProduct) {

//     }
//     let newCartProduct = {
//         id: productId,
//         title: productTitle,
//         price: productPrice,
//         quantity: productQuantity,
//         wantedQuantity: "1",
//         image: productImage
//     }

//     // Send a request
//     await fetch(baseURLCart, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newCartProduct)
//     })

//     getCartProducts()
// }

//create cart product
async function createCartProduct(productId, productTitle, productPrice, productQuantity, productImage) {
    // Check the role of the user to see if they can manipulate cart items
    const username = sessionStorage.getItem("username");
    const response = await fetch(baseURLUsers);
    const users = await response.json();
    const user = users.find(user => user.username === username);

    if (!user || user.role !== 'customer') {
        alert("You must be logged in as a customer to add a product to the cart.");
        return;
    }

    // Fetch existing cart products
    const cartResponse = await fetch(baseURLCart);
    const cartProducts = await cartResponse.json();

    // Check if the product already exists in the cart
    let existingProduct = cartProducts.find(product => product.id === productId);

    if (existingProduct) {
        // Update the quantity of the existing product
        existingProduct.quantity = parseInt(existingProduct.quantity) + 1;
        await fetch(baseURLCart + existingProduct.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(existingProduct)
        });
    } else {
        // If the product does not exist in the cart, add it
        let newCartProduct = {
            id: productId,
            title: productTitle,
            price: productPrice,
            quantity: 1,
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
        .then(data => {
            console.log(data)
            displayCartUI(data)
        });
}

getCartProducts()




//delete cart product
async function removeCartProduct(id) {
    await fetch(baseURLCart + id, {
        method: "DELETE"
    })
    getCartProducts()
}



const cartContentDiv = document.querySelector('.cart-content')
// async function displayCartUI(cartProducts) {

//     let cp = "";
//     if (!cartProducts.length) {
//         cp = `<p>No products in cart</p>`;
//     } else {
//         cartProducts.forEach((cartProduct, index) => {
//             cp += `
//                 <div class="cart-product">
//                     <div class="cart-product-image">
//                         <img src="${cartProduct.image}" alt="">
//                     </div>
//                     <div class="cart-product-details">
//                         <div>
//                             <h4>${cartProduct.title}</h4>
//                         </div>
//                         <div>
//                             <p>Price: ${cartProduct.price} Ksh</p>
//                             <div class="quantity-div">
//                                 <input type="number" value="1" class="quantity" oninput="calculateSubtotal(${index}, '${cartProduct.price}', ${cartProduct.quantity}, this.value)">
//                             </div>
//                             <p class="subTotal" id="subtotal-${index}">Total: </p>
//                             <button onclick="removeCartProduct('${cartProduct.id}')">Remove</button>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         });
//     }
//     cartContentDiv.innerHTML = cp;
// }
// Function to display cart products with quantity input initialized to 1
async function displayCartUI(cartProducts) {
    let cp = "";
    if (!cartProducts.length) {
        cp = `<p>No products in cart</p>`;
    } else {
        cartProducts.forEach((cartProduct, index) => {
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
                                <input type="number" class="quantity" value="${cartProduct.quantity}" oninput="calculateSubtotal(${index}, '${cartProduct.price}', ${cartProduct.quantity}, this.value)">
                            </div>
                            <p class="subTotal" id="subtotal-${index}">Total: </p>
                            <button onclick="removeCartProduct('${cartProduct.id}')">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    cartContentDiv.innerHTML = cp;
}


// Function to calculate subtotal of each product
function calculateSubtotal(index, cartProductPrice, productQuantity, cartProductQuantity) {
    let availableQuantity = parseInt(productQuantity);
    let requestedQuantity = parseInt(cartProductQuantity);

    if (requestedQuantity > availableQuantity) {
        window.alert("Quantities not available in stock");
    } else {
        let price = parseFloat(cartProductPrice.replace(/,/g, ''));
        let subtotal = price * requestedQuantity;
        document.getElementById(`subtotal-${index}`).innerText = `Total: ${subtotal} Ksh`;
    }
    calculateGrandTotal();
}

// Function to calculate the grand total
// const grandTotalDiv = document.querySelector('.grand-total');

// function calculateGrandTotal() {
//     let grandTotal = 0;

//     if (cartProducts.length === 0) {
//         grandTotalDiv.innerHTML = `<h4 class="totalPrice">Total Price: Ksh 0</h4>`;
//     } else {
//         cartProducts.forEach((cartProduct, index) => {
//             let subtotalElement = document.querySelector(`#subtotal-${index}`);
//             let subtotalValue = parseFloat(subtotalElement.innerText.split(':')[1].trim().replace(/,/g, ''));
//             grandTotal += subtotalValue;
//         });
//         grandTotalDiv.innerHTML = `<h4 class="totalPrice">Total Price: Ksh ${grandTotal.toFixed(2)}</h4>`;
//     }
// }



// Function to calculate the grand total
// const grandTotalDiv = document.querySelector('.grand-total');

// function calculateGrandTotal(cartProducts) {
//     let grandTotal = 0;

//     if (cartProducts.length === 0) {
//         grandTotalDiv.innerHTML = `<h4 class="totalPrice">Total Price: Ksh 0</h4>`;
//     } else {
//         cartProducts.forEach((cartProduct, index) => {
//             let subtotalElement = document.querySelector(`#subtotal-${index}`);
//             let subtotalValue = parseFloat(subtotalElement.innerText.split(':')[1].trim().replace(/,/g, ''));
//             grandTotal += subtotalValue;
//         });
//         grandTotalDiv.innerHTML = `<h4 class="totalPrice">Total Price: Ksh ${grandTotal.toFixed(2)}</h4>`;
//     }
// }


document.addEventListener("DOMContentLoaded", function () {
    const username = sessionStorage.getItem("username");
    document.querySelector(".username").textContent = username;
});




