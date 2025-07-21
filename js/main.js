document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productsContainer = document.getElementById('menu-product-list'); // Contenedor principal del menú
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartDeliveryElement = document.getElementById('cart-delivery');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryCost = 2500; // Costo de envío fijo

    // Datos del Menú (Asegúrate de que tus imágenes existan en la carpeta 'images/')
    const menuData = {
        "futomaki": {
            name: "Futomaki Rolls",
            description: "Nuestros rollos grandes, llenos de sabor y frescura.",
            products: [
                { id: 'futomaki1', name: 'FUTO KANI', price: 6800, description: 'Kanikama, palta, pepino, masago, cebollín.', image: 'images/futomaki_kani.jpg' },
                { id: 'futomaki2', name: 'FUTO CHICKEN', price: 6600, description: 'Pollo teriyaki, queso crema, palta, pimentón, ciboulette.', image: 'images/futomaki_chicken.jpg' },
                { id: 'futomaki3', name: 'FUTO SAKE', price: 6900, description: 'Salmón, palmito, palta, cebollín, pimentón.', image: 'images/futomaki_sake.jpg' },
                { id: 'futomaki4', name: 'FUTO EBI', price: 7000, description: 'Camarón, queso crema, masago, palta, ciboulette.', image: 'images/futomaki_ebi.jpg' },
                { id: 'futomaki5', name: 'FUTO TAKO', price: 7900, description: 'Pulpo, queso crema, palta, cebollín, pimentón.', image: 'images/futomaki_tako.jpg' },
                { id: 'futomaki6', name: 'FUTO MIX', price: 6400, description: 'Salmón, camarón, palta, queso crema, ciboulette.', image: 'images/futomaki_mix.jpg' },
                { id: 'futomaki7', name: 'FUTO ACEVICHADO', price: 5700, description: 'Queso crema, masago, palta, palmito.', image: 'images/futomaki_acevichado.jpg' },
                { id: 'futomaki8', name: 'FUTO SMOKE', price: 6500, description: 'Salmón ahumado, palta, pimentón, ciboulette, espárrago.', image: 'images/futomaki_smoke.jpg' },
                { id: 'futomaki9', name: 'FUTO VEGETAL PANKO', price: 5700, description: 'Cebollín panko, queso crema, espárrago, pimentón, ciboulette.', image: 'images/futomaki_vegetal.jpg' }
            ]
        },
        "hosomaki": {
            name: "Hosomaki Rolls",
            description: "Rollos finos, ideales para un bocado rápido.",
            products: [
                { id: 'hosomaki1', name: 'HOSO SAKE', price: 4500, description: 'Salmón, alga nori, arroz.', image: 'images/hosomaki_sake.jpg' },
                { id: 'hosomaki2', name: 'HOSO KANI', price: 4000, description: 'Kanikama, alga nori, arroz.', image: 'images/hosomaki_kani.jpg' },
                { id: 'hosomaki3', name: 'HOSO EBI', price: 5000, description: 'Camarón, alga nori, arroz.', image: 'images/hosomaki_ebi.jpg' },
                { id: 'hosomaki4', name: 'HOSO CHICKEN PANKO', price: 6000, description: 'Pollo Teriyaki, Queso Crema, Cebollín (Envuelto en Nori/Panko, 10 Cortes).', image: 'images/hoso_chicken_panko.jpg' }
            ]
        },
        "sake-rolls": {
            name: "Sake Rolls (Envueltos en Salmón)",
            description: "Rollos frescos envueltos en láminas de salmón.",
            products: [
                { id: 'sakeRoll1', name: 'SAKE KANI', price: 6800, description: 'Kanikama, palta, queso crema.', image: 'images/sakeroll_kani.jpg' },
                { id: 'sakeRoll2', name: 'SAKE EBI', price: 7200, description: 'Camarón, palta, queso crema.', image: 'images/sakeroll_ebi.jpg' },
                { id: 'sakeRoll3', name: 'SAKE CHICKEN', price: 6900, description: 'Pollo teriyaki, palta, queso crema.', image: 'images/sakeroll_chicken.jpg' },
                { id: 'sakeRoll4', name: 'SAKE NATURAL', price: 7500, description: 'Salmón, palta, masago.', image: 'images/sakeroll_natural.jpg' }
            ]
        },
        "uramaki": {
            name: "Uramaki Rolls (Envueltos en Arroz)",
            description: "Rollos con arroz por fuera, cubiertos con sésamo o masago.",
            products: [
                { id: 'uramaki1', name: 'URA CALIFORNIA', price: 5500, description: 'Kanikama, palta, pepino.', image: 'images/uramaki_california.jpg' },
                { id: 'uramaki2', name: 'URA TERIYAKI', price: 6000, description: 'Pollo teriyaki, queso crema, cebollín.', image: 'images/uramaki_teriyaki.jpg' },
                { id: 'uramaki3', name: 'URA EBI', price: 6300, description: 'Camarón tempura, queso crema, ají verde (Envuelto en Masago, 8 Cortes).', image: 'images/ura_ebi.jpg' },
                { id: 'uramaki4', name: 'MAKI GRAY ROLL', price: 4500, description: 'Queso Crema, Palta, Pepino (Envuelto en Amapola, 8 Cortes).', image: 'images/maki_gray_roll.jpg' },
                { id: 'uramaki5', name: 'ARMY SMOKE ROLL', price: 5300, description: 'Salmón Ahumado, Queso Crema, Palta (Envuelto en Sésamo/Ciboulette, 8 Cortes).', image: 'images/army_smoke_roll.jpg' }
            ]
        },
        "avocado-rolls": {
            name: "Avocado Rolls (Envueltos en Palta)",
            description: "Deliciosos rollos envueltos en cremosas láminas de palta.",
            products: [
                { id: 'avocadoRoll1', name: 'AVO SAKE', price: 7000, description: 'Salmón, queso crema, cebollín.', image: 'images/avocado_sake.jpg' },
                { id: 'avocadoRoll2', name: 'AVO EBI', price: 6200, description: 'Camarón, queso crema, palmito.', image: 'images/avocado_ebi.jpg' },
                { id: 'avocadoRoll3', name: 'AVO CHICKEN', price: 6500, description: 'Pollo teriyaki, queso crema, pimentón.', image: 'images/avocado_chicken.jpg' }
            ]
        },
        "cream-rolls": {
            name: "Cream Rolls (Envueltos en Queso Crema)",
            description: "Para los amantes del queso crema, una experiencia suave.",
            products: [
                { id: 'creamRoll1', name: 'CREAM EBI', price: 6800, description: 'Camarón, palta, masago.', image: 'images/cream_ebi.jpg' },
                { id: 'creamRoll2', name: 'CREAM SAKE', price: 7200, description: 'Salmón, palta, cebollín.', image: 'images/cream_sake.jpg' },
                { id: 'creamRoll3', name: 'CREAM CHICKEN', price: 6500, description: 'Pollo teriyaki, palta, champiñón.', image: 'images/cream_chicken.jpg' }
            ]
        },
        "tempuras-panko": {
            name: "Tempuras / Panko Rolls",
            description: "Rollos fritos y crujientes, una delicia caliente.",
            products: [
                { id: 'tempura1', name: 'LIKE EBI TEMPURA', price: 5800, description: 'Camarón, queso crema, ciboulette (Envuelto en Tempura, 8 Cortes).', image: 'images/ebi_tempura.jpg' },
                { id: 'tempura2', name: 'CHICKEN PANKO', price: 5500, description: 'Pollo teriyaki, queso crema, cebollín (Envuelto en Panko).', image: 'images/chicken_panko.jpg' },
                { id: 'tempura3', name: 'SALMON PANKO', price: 6000, description: 'Salmón, queso crema, ciboulette (Envuelto en Panko).', image: 'images/salmon_panko.jpg' }
            ]
        },
        "special-rolls": {
            name: "Special Rolls",
            description: "Combinaciones únicas y sabores que te sorprenderán.",
            products: [
                { id: 'special1', name: 'CRISPY ROLL', price: 7500, description: 'Salmón ahumado, queso crema, palta, envuelto en crispy tempura.', image: 'images/crispy_roll.jpg' },
                { id: 'special2', name: 'RAINBOW ROLL', price: 8000, description: 'Atún, salmón, camarón, palta, masago.', image: 'images/rainbow_roll.jpg' }
            ]
        },
        "rolls-sin-arroz": {
            name: "Rolls Sin Arroz",
            description: "Opciones ligeras y frescas, sin arroz, envueltos en pepino o alga.",
            products: [
                { id: 'noRice1', name: 'FRESH ROLL', price: 6900, description: 'Salmón, queso crema, palta, pepino, envuelto en alga nori y pepino.', image: 'images/fresh_roll.jpg' },
                { id: 'noRice2', name: 'Ceviche Roll', price: 7200, description: 'Pescado blanco, cilantro, cebolla morada, limón, envuelto en palta.', image: 'images/ceviche_roll.jpg' }
            ]
        },
        "tablas": {
            name: "Tablas",
            description: "Selecciones variadas para compartir, ideales para cada ocasión.",
            products: [
                { id: 'tabla1', name: 'TABLA MIXTA (20 Cortes)', price: 12000, description: '5 Futomaki, 5 Hosomaki, 5 Uramaki, 5 Niguiris.', image: 'images/tabla_mixta.jpg' },
                { id: 'tabla2', name: 'TABLA CLÁSICA (30 Cortes)', price: 18000, description: '10 Futomaki, 10 Hosomaki, 10 Uramaki.', image: 'images/tabla_clasica.jpg' },
                { id: 'tabla3', name: 'TABLA PREMIUM (40 Cortes)', price: 25000, description: '10 Sake Rolls, 10 Avocado Rolls, 10 Special Rolls, 10 Niguiris Crispy.', image: 'images/tabla_premium.jpg' }
            ]
        },
        "super-promos": {
            name: "Super Promos",
            description: "Las mejores ofertas para disfrutar al máximo tu Sushi Like.",
            products: [
                { id: 'promo1', name: 'PROMO DÚO (16 Cortes)', price: 9900, description: '2 Rolls a elección (8 cortes c/u) + Bebida.', image: 'images/promo_duo.jpg' },
                { id: 'promo2', name: 'PROMO FAMILIAR (32 Cortes)', price: 19900, description: '4 Rolls a elección (8 cortes c/u) + 2 Bebidas + Gohan.', image: 'images/promo_familiar.jpg' }
            ]
        },
        "gohan": {
            name: "Gohan (Bowl de Arroz)",
            description: "Deliciosos bowls de arroz con tus ingredientes favoritos.",
            products: [
                { id: 'gohan1', name: 'GOHAN POLLO', price: 7000, description: 'Arroz, pollo teriyaki, palta, cebollín, sésamo.', image: 'images/gohan_pollo.jpg' },
                { id: 'gohan2', name: 'GOHAN SALMÓN', price: 7500, description: 'Arroz, salmón, palta, queso crema, ciboulette.', image: 'images/gohan_salmon.jpg' }
            ]
        },
        "sashimi": {
            name: "Sashimi",
            description: "Finas láminas de pescado fresco, sin arroz.",
            products: [
                { id: 'sashimi1', name: 'SASHIMI SALMÓN (6 Cortes)', price: 8000, description: 'Finas láminas de salmón fresco.', image: 'images/sashimi_salmon.jpg' },
                { id: 'sashimi2', name: 'SASHIMI ATÚN (6 Cortes)', price: 9000, description: 'Finas láminas de atún fresco.', image: 'images/sashimi_atun.jpg' }
            ]
        },
        "snacks-tempurizados": {
            name: "Snacks Tempurizados",
            description: "Acompañamientos crujientes y llenos de sabor.",
            products: [
                { id: 'snack1', name: 'GYOZAS DE POLLO (5 Unid.)', price: 4000, description: 'Empanaditas japonesas de pollo.', image: 'images/gyozas_pollo.jpg' },
                { id: 'snack2', name: 'CAMARONES TEMPURA (5 Unid.)', price: 5500, description: 'Camarones apanados en tempura.', image: 'images/camarones_tempura.jpg' }
            ]
        },
        "nigiris": {
            name: "Nigiris",
            description: "Pequeñas porciones de arroz con pescado fresco encima.",
            products: [
                { id: 'nigiri1', name: 'NIGIRI SALMÓN (2 Unid.)', price: 3500, description: 'Salmón fresco sobre arroz.', image: 'images/nigiri_salmon.jpg' },
                { id: 'nigiri2', name: 'NIGIRI EBI (2 Unid.)', price: 3000, description: 'Camarón sobre arroz.', image: 'images/nigiri_ebi.jpg' }
            ]
        },
        "nigiris-crispy": {
            name: "Nigiris Crispy",
            description: "Nigiris con un toque crujiente, para una experiencia diferente.",
            products: [
                { id: 'nigiriCrispy1', name: 'NIGIRI SALMÓN CRISPY (2 Unid.)', price: 4000, description: 'Salmón sobre arroz frito y salsa acevichada.', image: 'images/nigiri_salmon_crispy.jpg' },
                { id: 'nigiriCrispy2', name: 'NIGIRI POLLO CRISPY (2 Unid.)', price: 3800, description: 'Pollo teriyaki sobre arroz frito y salsa unagi.', image: 'images/nigiri_pollo_crispy.jpg' }
            ]
        },
        "bebidas": {
            name: "Bebidas",
            description: "Refresca tu paladar con nuestras opciones.",
            products: [
                { id: 'bebida1', name: 'BEBIDA LATA', price: 1500, description: 'Coca-Cola, Sprite, Fanta, etc.', image: 'images/bebida_lata.jpg' },
                { id: 'bebida2', name: 'AGUA MINERAL', price: 1200, description: 'Agua mineral con o sin gas.', image: 'images/agua_mineral.jpg' }
            ]
        },
        "extras": {
            name: "Extras",
            description: "Salsas adicionales para complementar tu pedido.",
            products: [
                { id: 'extra1', name: 'SOYA', price: 500, description: 'Salsa de soya tradicional.', image: 'images/extra_soya.jpg' },
                { id: 'extra2', name: 'AGRIDULCE', price: 600, description: 'Salsa agridulce especial.', image: 'images/extra_agridulce.jpg' },
                { id: 'extra3', name: 'JENGIBRE', price: 700, description: 'Rodajas de jengibre encurtido.', image: 'images/extra_jengibre.jpg' }
            ]
        }
    };


    // Función para renderizar el menú en la página
    function renderMenu() {
        if (!productsContainer) return; // Salir si el contenedor no existe (estamos en otra página HTML)

        productsContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

        for (const categoryKey in menuData) {
            const category = menuData[categoryKey];
            const categorySection = document.createElement('section');
            // IMPORTANTE: Asegúrate de que el ID de la sección coincida con el href de los enlaces de navegación
            categorySection.id = categoryKey;
            categorySection.classList.add('menu-category-section');

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.name;
            categorySection.appendChild(categoryTitle);

            const categoryDescription = document.createElement('p');
            categoryDescription.textContent = category.description;
            categorySection.appendChild(categoryDescription);

            const productList = document.createElement('div');
            productList.classList.add('product-list');

            category.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                // Asegúrate de que la imagen exista en la carpeta 'images/'
                const productImage = document.createElement('img');
                productImage.src = product.image || 'images/default_sushi.jpg'; // Imagen por defecto si no hay
                productImage.alt = product.name;
                productCard.appendChild(productImage);

                const productName = document.createElement('h3');
                productName.textContent = product.name;
                productCard.appendChild(productName);

                const productDescription = document.createElement('p');
                productDescription.classList.add('ingredients'); // Clase para estilos de ingredientes
                productDescription.textContent = product.description;
                productCard.appendChild(productDescription);

                const productPrice = document.createElement('span');
                productPrice.classList.add('price');
                productPrice.textContent = `$${product.price.toLocaleString('es-CL')}`; // Formato CLP
                productCard.appendChild(productPrice);

                const addToCartBtn = document.createElement('button');
                addToCartBtn.classList.add('add-to-cart-btn');
                addToCartBtn.textContent = 'Agregar al Carrito';
                addToCartBtn.dataset.productId = product.id; // Guarda el ID del producto
                addToCartBtn.dataset.productName = product.name;
                addToCartBtn.dataset.productPrice = product.price;
                addToCartBtn.addEventListener('click', addProductToCart);
                productCard.appendChild(addToCartBtn);

                productList.appendChild(productCard);
            });

            categorySection.appendChild(productList);
            productsContainer.appendChild(categorySection);
        }
    }

    // Función para agregar producto al carrito
    function addProductToCart(event) {
        const productId = event.target.dataset.productId;
        const productName = event.target.dataset.productName;
        const productPrice = parseFloat(event.target.dataset.productPrice);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }

        saveCart();
        updateCartDisplay();
        alert(`${productName} ha sido agregado al carrito.`);
    }

    // Función para actualizar el carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para actualizar la UI del carrito (cantidad en el header, y listado en carrito.html)
    function updateCartDisplay() {
        // Actualizar contador en el header
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }

        // Si estamos en la página del carrito, actualizar el listado y el total
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = ''; // Limpiar antes de actualizar
            let subtotal = 0;

            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                checkoutBtn.disabled = true;
                cartSubtotalElement.textContent = '$0';
                cartDeliveryElement.textContent = '$0';
                cartTotalElement.textContent = '$0';
                return;
            } else {
                emptyCartMessage.style.display = 'none';
                checkoutBtn.disabled = false;
            }

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toLocaleString('es-CL')} c/u</p>
                    </div>
                    <div class="cart-item-controls">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                        <button data-id="${item.id}" data-action="remove">Remover</button>
                    </div>
                    <div class="cart-item-price">
                        $${(item.price * item.quantity).toLocaleString('es-CL')}
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                subtotal += item.price * item.quantity;
            });

            const total = subtotal + deliveryCost;
            cartSubtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
            cartDeliveryElement.textContent = `$${deliveryCost.toLocaleString('es-CL')}`;
            cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;

            // Añadir event listeners a los botones de control del carrito
            cartItemsContainer.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', handleCartItemControl);
            });
        }
    }

    // Manejar botones de control del carrito (+, -, Remover)
    function handleCartItemControl(event) {
        const productId = event.target.dataset.id;
        const action = event.target.dataset.action;

        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); // Eliminar si la cantidad llega a 0
                }
            } else if (action === 'remove') {
                cart.splice(itemIndex, 1); // Eliminar directamente
            }
            saveCart();
            updateCartDisplay();
        }
    }

    // Funcionalidad para la página de Checkout (ejemplo simple)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('¡Pedido realizado con éxito!\nTotal: ' + cartTotalElement.textContent + '\nGracias por tu compra.');
                localStorage.removeItem('cart'); // Limpiar carrito después de la compra
                cart = [];
                updateCartDisplay();
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Lógica para el carrusel de imágenes en index.html
    const carouselImages = document.querySelectorAll('.carousel-img');
    let currentImageIndex = 0;

    function showNextImage() {
        if (carouselImages.length === 0) return;

        carouselImages[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
        carouselImages[currentImageIndex].classList.add('active');
    }

    // Inicializar carrusel si estamos en index.html y hay imágenes
    if (document.querySelector('.hero') && carouselImages.length > 0) {
        carouselImages[currentImageIndex].classList.add('active'); // Mostrar la primera imagen
        setInterval(showNextImage, 5000); // Cambiar imagen cada 5 segundos
    }


    // Inicializar al cargar la página
    updateCartDisplay(); // Actualiza el contador del carrito en el header en todas las páginas

    // Renderizar el menú solo si estamos en la página del menú
    if (productsContainer) {
        renderMenu();
    }
});
