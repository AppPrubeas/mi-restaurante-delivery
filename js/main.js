document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productsContainer = document.querySelector('.product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // Elementos de la dirección
    const deliveryCommuneSelect = document.getElementById('delivery-commune-select');
    const deliveryStreetAddressInput = document.getElementById('delivery-street-address');

    // Elemento del select de método de pago
    const paymentMethodSelect = document.getElementById('payment-method');

    // --- Variables de Estado ---

    // **CAMBIO CLAVE AQUI:** Cargar el carrito desde localStorage o inicializarlo vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // **CAMBIO CLAVE AQUI:** Cargar el método de pago desde localStorage o inicializarlo vacío
    let selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod') || '';
    // **CAMBIO CLAVE AQUI:** Cargar la comuna seleccionada desde localStorage
    let selectedCommune = localStorage.getItem('selectedCommune') || '';
    // **CAMBIO CLAVE AQUI:** Cargar la dirección de la calle desde localStorage
    let streetAddress = localStorage.getItem('streetAddress') || '';


    // --- Costos de Envío por Comuna ---
    // ¡IMPORTANTE! Personaliza estos valores y comunas según tu negocio.
    const shippingCosts = {
        'Quilpué': 2500, // Costo para Quilpué
        'Villa Alemana': 3000, // Costo para Villa Alemana
        'Limache': 4500,     // Costo para Limache
        'Viña del Mar': 5000, // Costo para Viña del Mar (ejemplo si despachas lejos)
        '': 0 // Si no hay comuna seleccionada, el costo es 0 (o puedes poner un mensaje de error)
    };

    // --- Funciones de guardado en localStorage ---
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function savePaymentMethodToLocalStorage() {
        localStorage.setItem('selectedPaymentMethod', selectedPaymentMethod);
    }

    function saveCommuneToLocalStorage() {
        localStorage.setItem('selectedCommune', selectedCommune);
    }

    function saveStreetAddressToLocalStorage() {
        localStorage.setItem('streetAddress', streetAddress);
    }


    // --- Funciones del Carrito y UI ---

    function saveCart() {
        // Ahora sí, guarda en localStorage
        saveCartToLocalStorage();
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

    function calculateShippingCost() {
        return shippingCosts[selectedCommune] || 0; // Retorna el costo de la comuna o 0 si no se encuentra
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        const currentShippingCost = calculateShippingCost(); // Obtener el costo de envío dinámicamente

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

        const total = subtotal + (cart.length > 0 ? currentShippingCost : 0);
        cartSubtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
        cartShippingElement.textContent = cart.length > 0 ? `$${currentShippingCost.toLocaleString('es-CL')}` : '$0';
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // --- Event Listeners ---

    // Inicializar campos de dirección y pago con valores guardados
    if (deliveryCommuneSelect) {
        deliveryCommuneSelect.value = selectedCommune;
        deliveryCommuneSelect.addEventListener('change', (e) => {
            selectedCommune = e.target.value;
            saveCommuneToLocalStorage(); // Guardar la comuna
            renderCart(); // Vuelve a renderizar el carrito para actualizar el costo de envío
        });
    }

    if (deliveryStreetAddressInput) {
        deliveryStreetAddressInput.value = streetAddress; // Inicializar
        deliveryStreetAddressInput.addEventListener('input', (e) => {
            streetAddress = e.target.value;
            saveStreetAddressToLocalStorage(); // Guardar la dirección
        });
    }

    if (paymentMethodSelect) {
        paymentMethodSelect.value = selectedPaymentMethod; // Inicializar
        paymentMethodSelect.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value;
            savePaymentMethodToLocalStorage(); // Guardar el método de pago
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
            // Validaciones
            if (cart.length === 0) {
                alert("Tu carrito está vacío. Por favor, agrega productos antes de hacer un pedido.");
                return;
            }
            if (!selectedCommune) {
                alert("Por favor, selecciona tu comuna.");
                return;
            }
            if (!streetAddress.trim()) {
                alert("Por favor, ingresa tu dirección completa (calle y número).");
                return;
            }
            if (selectedPaymentMethod === "" || selectedPaymentMethod === "No especificado") {
                alert("Por favor, selecciona un método de pago antes de hacer el pedido.");
                return;
            }

            const phoneNumber = "56929337063"; // ¡IMPORTANTE: Reemplaza con tu número de teléfono de WhatsApp (sin + ni espacios)!
            const finalPaymentMethod = selectedPaymentMethod;
            const finalShippingCost = calculateShippingCost(); // Obtener el costo de envío final

            let whatsappMessage = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";

            whatsappMessage += `📍 *Dirección de Envío:*\n`;
            whatsappMessage += `   - Comuna: ${selectedCommune}\n`;
            whatsappMessage += `   - Calle y Número: ${streetAddress}\n`;
            whatsappMessage += `💳 *Método de Pago:* ${finalPaymentMethod}\n\n`;

            let orderSubtotal = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                whatsappMessage += `- ${item.name} x ${item.quantity} = $${itemTotal.toLocaleString('es-CL')}\n`;
                orderSubtotal += itemTotal;
            });

            const orderTotal = orderSubtotal + finalShippingCost;

            whatsappMessage += `\n--- Resumen del Pedido ---\n`;
            whatsappMessage += `Subtotal: $${orderSubtotal.toLocaleString('es-CL')}\n`;
            whatsappMessage += `Costo de Envío: $${finalShippingCost.toLocaleString('es-CL')}\n`;
            whatsappMessage += `*Total Final: $${orderTotal.toLocaleString('es-CL')}*\n\n`;
            whatsappMessage += "¡Muchas gracias!";

            const encodedMessage = encodeURIComponent(whatsappMessage);

            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

            // **CAMBIO AQUI:** Opcional: Limpiar el carrito y los campos después de enviar el pedido
            // Esto asegura que el carrito y los datos se reinicien solo DESPUÉS de un pedido exitoso.
            cart = [];
            selectedCommune = '';
            streetAddress = '';
            selectedPaymentMethod = '';
            // Limpiar localStorage después de un pedido
            localStorage.removeItem('cart');
            localStorage.removeItem('selectedCommune');
            localStorage.removeItem('streetAddress');
            localStorage.removeItem('selectedPaymentMethod');

            if (deliveryCommuneSelect) deliveryCommuneSelect.value = '';
            if (deliveryStreetAddressInput) deliveryStreetAddressInput.value = '';
            if (paymentMethodSelect) paymentMethodSelect.value = '';
            saveCart(); // Actualiza la UI y el localStorage vacío
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
    // También se inicializan los campos de dirección/pago con los valores guardados
    updateCartCount();
    renderCart();
});
