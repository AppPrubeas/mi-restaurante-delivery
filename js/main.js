document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productsContainer = document.querySelector('.product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const deliveryAddressInput = document.getElementById('delivery-address-input');
    const paymentMethodSelect = document.getElementById('payment-method');

    // --- Funciones del Carrito ---

    // El carrito siempre inicia vacío, no se carga desde localStorage
    let cart = [];
    // El método de pago siempre inicia sin seleccionar
    let selectedPaymentMethod = '';

    // No necesitamos saveAddress ni loadAddress si no queremos persistencia
    // Solo si el input existe en la página actual (ej: index.html), lo inicializamos
    if (deliveryAddressInput) {
        deliveryAddressInput.value = ''; // Asegura que el campo esté vacío al cargar la página
    }

    // No necesitamos savePaymentMethod ni loadPaymentMethod si no queremos persistencia
    // Solo si el select existe en la página actual (ej: carrito.html), lo inicializamos
    if (paymentMethodSelect) {
        paymentMethodSelect.value = ''; // Asegura que la opción "Selecciona..." esté activa
    }

    // saveCart ya no guardará en localStorage, solo actualizará UI
    function saveCart() {
        // Anteriormente: localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
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
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        const shippingCost = 2500;

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

        const total = subtotal + (cart.length > 0 ? shippingCost : 0);
        cartSubtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
        cartShippingElement.textContent = cart.length > 0 ? `$${shippingCost.toLocaleString('es-CL')}` : '$0';
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // --- Event Listeners ---

    // Evento para obtener la dirección al escribir (solo en index.html)
    // No guarda en localStorage, solo actualiza una variable temporal si es necesario para el envío
    if (deliveryAddressInput) {
        deliveryAddressInput.addEventListener('input', (e) => {
            // Si la dirección no se guarda, necesitarías obtenerla justo antes de enviar el WhatsApp
            // Por ahora, solo se obtiene en el momento de hacer el pedido.
        });
    }

    // Evento para obtener el método de pago al seleccionar
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value; // Actualiza la variable global
        });
    }

    // Evento para añadir productos al carrito
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

    // Eventos para el carrito
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
            // Obtener la dirección directamente del input al momento del pedido
            const customerAddress = deliveryAddressInput ? deliveryAddressInput.value : "No se especificó dirección.";
            const phoneNumber = "56929337063"; // ¡IMPORTANTE: Reemplaza con tu número de teléfono de WhatsApp (sin + ni espacios)!
            const finalPaymentMethod = selectedPaymentMethod || "No especificado";

            if (cart.length === 0) {
                alert("Tu carrito está vacío. Por favor, agrega productos antes de hacer un pedido.");
                return;
            }

            if (finalPaymentMethod === "" || finalPaymentMethod === "No especificado") {
                alert("Por favor, selecciona un método de pago antes de hacer el pedido.");
                return;
            }

            let whatsappMessage = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";

            whatsappMessage += `📍 *Dirección de Envío:* ${customerAddress}\n`;
            whatsappMessage += `💳 *Método de Pago:* ${finalPaymentMethod}\n\n`;

            let orderTotal = 0;
            const shippingCost = 2500;

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

            const encodedMessage = encodeURIComponent(whatsappMessage);

            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

            // Opcional: Limpiar el carrito después de enviar el pedido
            // Si quieres que el carrito se reinicie DE INMEDIATO después de enviar el WhatsApp
            // cart = [];
            // saveCart(); // Esto actualizaría la UI y mostraría el carrito vacío
        });
    }

    // --- Carrusel de Imágenes (Solo en index.html) ---
    const carouselImages = document.querySelectorAll('.carousel-img');
    let currentImageIndex = 0;

    function showNextImage() {
        if (!carouselImages.length) return;

        carouselImages[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
        carouselImages[currentImageIndex].classList.add('active');
    }

    if (carouselImages.length > 0) {
        setInterval(showNextImage, 4000);
    }

    // Inicializar: actualizar el contador del carrito y renderizar el carrito
    // No se carga nada desde localStorage al inicio.
    updateCartCount();
    renderCart();
});
