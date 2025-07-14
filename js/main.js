document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productsContainer = document.querySelector('.product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    // Nuevo: Elemento del input de dirección
    const deliveryAddressInput = document.getElementById('delivery-address-input');

    // --- Funciones del Carrito ---

    // Cargar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para guardar la dirección en localStorage
    function saveAddress(address) {
        localStorage.setItem('deliveryAddress', address);
    }

    // Función para cargar la dirección desde localStorage
    function loadAddress() {
        if (deliveryAddressInput) { // Solo si el input existe en la página actual (ej: index.html)
            deliveryAddressInput.value = localStorage.getItem('deliveryAddress') || '';
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart(); // Para asegurar que el carrito se actualice en todas las páginas si es necesario
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) { // Verificar si el elemento existe en la página actual
            cartCountElement.textContent = totalItems;
        }
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`"${product.name}" ha sido añadido al carrito.`);
    }

    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        saveCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return; // Salir si no estamos en la página del carrito

        cartItemsContainer.innerHTML = ''; // Limpiar carrito antes de renderizar
        let subtotal = 0;
        const shippingCost = 2500; // Define tu costo de envío aquí (en CLP)

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.style.display = 'block';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Precio: $${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                        <button data-id="${item.id}" data-action="remove">X</button>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toLocaleString('es-CL')}</div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        const total = subtotal + (cart.length > 0 ? shippingCost : 0); // Sumar envío solo si hay productos
        cartSubtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
        cartShippingElement.textContent = cart.length > 0 ? `$${shippingCost.toLocaleString('es-CL')}` : '$0';
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // --- Event Listeners ---

    // Evento para guardar la dirección al escribir (solo en index.html)
    if (deliveryAddressInput) {
        deliveryAddressInput.addEventListener('input', (e) => {
            saveAddress(e.target.value);
        });
    }

    // Evento para añadir productos al carrito (en páginas de menú de categoría)
    if (productsContainer) {
        productsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: parseFloat(productCard.dataset.price)
                };
                addToCart(product);
            }
        });
    }

    // Eventos para el carrito (en la página del carrito)
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            if (!productId) return;

            if (e.target.dataset.action === 'increase') {
                updateQuantity(productId, 1);
            } else if (e.target.dataset.action === 'decrease') {
                updateQuantity(productId, -1);
            } else if (e.target.dataset.action === 'remove') {
                removeFromCart(productId);
            }
        });
    }

    // Evento para el botón de "Hacer Pedido por WhatsApp"
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Obtener la dirección guardada
            const customerAddress = localStorage.getItem('deliveryAddress') || "No se especificó dirección.";
            const phoneNumber = "56929337063"; // ¡IMPORTANTE: Reemplaza con tu número de teléfono de WhatsApp (sin + ni espacios)!

            if (cart.length === 0) {
                alert("Tu carrito está vacío. Por favor, agrega productos antes de hacer un pedido.");
                return; // Detener la ejecución si el carrito está vacío
            }

            let whatsappMessage = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";

            // Incluir la dirección al inicio del mensaje
            whatsappMessage += `📍 *Dirección de Envío:* ${customerAddress}\n\n`;

            let orderTotal = 0;
            const shippingCost = 2500; // Costo de envío para el mensaje de WhatsApp

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                whatsappMessage += `- ${item.name} x ${item.quantity} = $${itemTotal.toLocaleString('es-CL')}\n`;
                orderTotal += itemTotal;
            });

            whatsappMessage += `\n--- Resumen del Pedido ---\n`;
            whatsappMessage += `Subtotal: $${orderTotal.toLocaleString('es-CL')}\n`;
            whatsappMessage += `Costo de Envío: $${shippingCost.toLocaleString('es-CL')}\n`;
            whatsappMessage += `*Total Final: $${(orderTotal + shippingCost).toLocaleString('es-CL')}*\n\n`;
            whatsappMessage += "¡Muchas gracias!";

            // Codificar el mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        });
    }

    // --- Carrusel de Imágenes (Solo en index.html) ---
    const carouselImages = document.querySelectorAll('.carousel-img');
    let currentImageIndex = 0;

    function showNextImage() {
        if (!carouselImages.length) return; // Salir si no hay imágenes (no estamos en index.html)

        carouselImages[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
        carouselImages[currentImageIndex].classList.add('active');
    }

    if (carouselImages.length > 0) {
        setInterval(showNextImage, 4000); // Cambia de imagen cada 4 segundos
    }

    // Inicializar: actualizar el contador del carrito, renderizar el carrito y cargar la dirección
    updateCartCount();
    renderCart(); // Se ejecutará solo si document.getElementById('cart-items') existe
    loadAddress(); // Cargar la dirección al iniciar la página (si el input existe)
});
