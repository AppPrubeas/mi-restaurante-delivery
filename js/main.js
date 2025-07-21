document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productsContainer = document.getElementById('menu-product-list'); // Cambiado para el menú dinámico
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
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod') || '';
    let selectedCommune = localStorage.getItem('selectedCommune') || '';
    let streetAddress = localStorage.getItem('streetAddress') || '';


    // --- Costos de Envío por Comuna ---
    const shippingCosts = {
        'Quilpué': 2500,
        'Villa Alemana': 2000, // Ajustado para Villa Alemana como ubicación principal
        'Limache': 4500,
        'Viña del Mar': 5000,
        '': 0
    };

    // --- Datos del Menú (extraídos del PDF) ---
    // Cada producto debe tener un ID único, nombre y precio.
    // Opcional: descripción, imagen.
    const menuData = {
        "futomaki": {
            name: "FUTOMAKI ROLLS",
            description: "Roll Gigante de 10 Cortes Envuelto en Alga Nori",
            products: [
                [cite_start]{ id: "futo-kani", name: "FUTO KANI", description: "Kanikama, Palta, Pepino, Masago, Cebollín", price: 6800 }, [cite: 1]
                [cite_start]{ id: "futo-chicken", name: "FUTO CHICKEN", description: "Pollo Teriyaki, Queso Crema, Palta, Pimentón, Ciboulette", price: 6600 }, [cite: 1]
                [cite_start]{ id: "futo-sake", name: "FUTO SAKE", description: "Salmón, Palmito, Palta, Cebollín, Pimentón", price: 6900 }, [cite: 1]
                [cite_start]{ id: "futo-ebi", name: "FUTO EBI", description: "Camarón, Queso Crema, Masago, Palta, Ciboulette", price: 7000 }, [cite: 1]
                [cite_start]{ id: "futo-tako", name: "FUTO TAKO", description: "Pulpo, Queso Crema, Palta, Cebollín, Pimentón", price: 6900 }, [cite: 1]
                [cite_start]{ id: "futo-mix", name: "FUTO MIX", description: "Salmón, Camarón, Palta, Queso Crema, Cebollín", price: 7900 }, [cite: 1]
                [cite_start]{ id: "futo-acevichado", name: "FUTO ACEVICHADO", description: "Queso Crema, Masago, Palta, Palmito", price: 6400 }, [cite: 1]
                [cite_start]{ id: "futo-smoke", name: "FUTO SMOKE", description: "Salmón Ahumado, Palta, Pimentón, Ciboulette, Espárrago", price: 7000 }, [cite: 1]
                [cite_start]{ id: "futo-vegetal-panko", name: "FUTO VEGETAL PANKO", description: "Cebollín Panko, Queso Crema, Espárrago, Pimentón, Ciboulette", price: 5700 } [cite: 1]
            ]
        },
        "hosomaki": {
            name: "HOSOMAKI ROLLS",
            description: "Roll de 6 Cortes Envuelto en Alga Nori",
            products: [
                [cite_start]{ id: "hoso-kani", name: "HOSO KANI", description: "Kanikama, Palta", price: 3200 }, [cite: 66]
                [cite_start]{ id: "hoso-chicken", name: "HOSO CHICKEN", description: "Pollo Teriyaki, Queso Crema, Cebollín", price: 3600 }, [cite: 66]
                [cite_start]{ id: "hoso-sake", name: "HOSO SAKE", description: "Salmón, Queso Crema", price: 3900 }, [cite: 66]
                [cite_start]{ id: "hoso-ebi", name: "HOSO EBI", description: "Camarón, Queso Crema, Ciboulette", price: 3700 }, [cite: 66]
                [cite_start]{ id: "hoso-tako", name: "HOSO TAKO", description: "Pulpo, Queso Crema, Cebollín", price: 4400 }, [cite: 66]
                [cite_start]{ id: "hoso-smoke", name: "HOSO SMOKE", description: "Salmón Ahumado, Palta, Ciboulette", price: 3800 }, [cite: 66]
                [cite_start]{ id: "hoso-vegetal", name: "HOSO VEGETAL", description: "Palmito, Espárrago", price: 3100 }, [cite: 66]
                [cite_start]{ id: "hoso-ton", name: "HOSO TON", description: "Atún, Palta", price: 4100 } [cite: 66]
            ]
        },
        "sake-rolls": {
            name: "SAKE ROLLS",
            description: "Roll de 8 Cortes Envuelto en Salmón",
            products: [
                [cite_start]{ id: "sake-kani", name: "SAKE KANI", description: "Kanikama, Palta, Ciboulette", price: 5900 }, [cite: 79]
                [cite_start]{ id: "sake-ebi-roll", name: "SAKE EBI ROLL", description: "Camarón, Queso Crema, Masago", price: 6400 }, [cite: 79]
                [cite_start]{ id: "sake-tako", name: "SAKE TAKO", description: "Pulpo, Queso Crema, Cebollín", price: 7000 }, [cite: 79]
                [cite_start]{ id: "garden-sake", name: "GARDEN SAKE", description: "Palmito, Espárrago, Palta", price: 5800 }, [cite: 79]
                [cite_start]{ id: "sake-smoke", name: "SAKE SMOKE", description: "Salmón Ahumado, Queso Crema, Palta", price: 6500 }, [cite: 79]
                [cite_start]{ id: "sake-ebi-pankonanese", name: "SAKE EBI PANKONANESE", description: "Camarón Panko, Queso Crema, Cebollín", price: 6700 }, [cite: 79]
                [cite_start]{ id: "sake-acevichado", name: "SAKE ACEVICHADO", description: "Queso Crema, Palta, Palmito", price: 8000 }, [cite: 79]
                [cite_start]{ id: "sake-vegetal-panko", name: "SAKE VEGETAL PANKO", description: "Cebollín Panko, Queso Crema, Espárrago", price: 5900 } [cite: 79]
            ]
        },
        "uramaki": {
            name: "URAMAKI ROLLS",
            [cite_start]description: "Roll de 8 Cortes Envuelto en Sésamo, Amapola o Coco/Merquén", [cite: 151]
            products: [
                [cite_start]{ id: "california-kani", name: "CALIFORNIA KANI", description: "Kanikama, Palta", price: 4400 }, [cite: 156]
                [cite_start]{ id: "california-chicken", name: "CALIFORNIA CHICKEN", description: "Pollo Teriyaki, Palta", price: 4800 }, [cite: 156]
                [cite_start]{ id: "california-sake", name: "CALIFORNIA SAKE", description: "Salmón, Palta", price: 5300 }, [cite: 156]
                [cite_start]{ id: "california-ebi", name: "CALIFORNIA EBI", description: "Camarón, Palta", price: 4900 }, [cite: 156]
                [cite_start]{ id: "california-vegetal", name: "CALIFORNIA VEGETAL", description: "Palmito, Palta, Ciboulette, Espárrago", price: 4700 }, [cite: 156]
                [cite_start]{ id: "maki-ebi-tempura", name: "MAKI EBI TEMPURA", description: "Camarón Tempura, Queso Crema, Ciboulette", price: 5600 }, [cite: 156]
                [cite_start]{ id: "maki-yaki-panko", name: "MAKI YAKI PANKO", description: "Pollo Panko, Queso Crema, Cebollín", price: 5500 }, [cite: 156]
                [cite_start]{ id: "maki-sake-panko", name: "MAKI SAKE PANKO", description: "Salmón Panko, Queso Crema, Cebollín", price: 5900 }, [cite: 156]
                [cite_start]{ id: "smoke-maki", name: "SMOKE MAKI", description: "Salmón Ahumado, Queso Crema, Cebollín", price: 5200 }, [cite: 156]
                [cite_start]{ id: "maki-kani", name: "MAKI KANI", description: "Kanikama, Queso Crema, Palta", price: 4700 }, [cite: 156]
                [cite_start]{ id: "maki-yaki", name: "MAKI YAKI", description: "Pollo Teriyaki, Queso Crema, Palta", price: 5300 }, [cite: 156]
                [cite_start]{ id: "sake-maki-ura", name: "SAKE MAKI", description: "Salmón, Queso Crema, Palta", price: 5700 }, [cite: 156]
                [cite_start]{ id: "ebi-maki-ura", name: "EBI MAKI", description: "Camarón, Queso Crema, Palta, Ciboulette", price: 5400 }, [cite: 156]
                [cite_start]{ id: "tako-maki-roll-ura", name: "TAKO MAKI ROLL", description: "Pulpo, Palta, Ciboulette", price: 5900 }, [cite: 156]
                [cite_start]{ id: "ebi-spicy", name: "EBI SPICY", description: "Camarón, Palta, Ciboulette, Sriracha", price: 5000 }, [cite: 156]
                [cite_start]{ id: "maguro-maki", name: "MAGURO MAKI", description: "Atún, Palta, Ciboulette", price: 5500 }, [cite: 156]
                [cite_start]{ id: "ura-vegan", name: "URA VEGAN", description: "Palta, Pepino, Cebollín", price: 4400 }, [cite: 156]
                [cite_start]{ id: "ura-acevichado", name: "URA ACEVICHADO", description: "Queso Crema, Palmito, Palta", price: 6500 } [cite: 156]
            ]
        },
        "avocado-rolls": {
            name: "AVOCADO ROLLS",
            [cite_start]description: "Roll de 8 Cortes Envuelto en Palta", [cite: 152]
            products: [
                [cite_start]{ id: "avo-kani", name: "AVO KANI", description: "Kanikama, Queso Crema, Cebollín", price: 5400 }, [cite: 157]
                [cite_start]{ id: "avo-chicken", name: "AVO CHICKEN", description: "Pollo Teriyaki, Queso Crema, Cebollín", price: 6200 }, [cite: 157]
                [cite_start]{ id: "avo-sake", name: "AVO SAKE", description: "Salmón, Queso Crema, Ciboulette", price: 6500 }, [cite: 157]
                [cite_start]{ id: "avo-ebi", name: "AVO EBI", description: "Camarón, Queso Crema, Cebollín", price: 6400 }, [cite: 157]
                [cite_start]{ id: "tako-roll-avo", name: "TAKO ROLL", description: "Pulpo, Queso Crema, Cebollín", price: 6600 }, [cite: 157]
                [cite_start]{ id: "avo-fresh", name: "AVO FRESH", description: "Palmito, Espárrago, Cebollín", price: 5200 }, [cite: 157]
                [cite_start]{ id: "teri-panko", name: "TERI PANKO", description: "Pollo Panko, Queso Crema, Cebollín", price: 6500 }, [cite: 157]
                [cite_start]{ id: "avo-sake-panko", name: "AVO SAKE PANKO", description: "Salmón Panko, Queso Crema, Cebollín", price: 6900 }, [cite: 157]
                [cite_start]{ id: "avo-ebi-tempura", name: "AVO EBI TEMPURA", description: "Camarón Tempura, Queso Crema, Ciboulette", price: 6700 }, [cite: 157]
                [cite_start]{ id: "avo-smoke-roll", name: "AVO SMOKE ROLL", description: "Salmón Ahumado, Queso Crema, Cebollín", price: 6200 }, [cite: 157]
                [cite_start]{ id: "avo-mix", name: "AVO MIX", description: "Salmón, Camarón, Queso Crema, Cebollín", price: 6900 }, [cite: 157]
                [cite_start]{ id: "avo-tropical", name: "AVO TROPICAL", description: "Salmón, Mango", price: 6600 }, [cite: 157]
                [cite_start]{ id: "ebi-like", name: "EBI LIKE", description: "Camarón, Queso Crema, Masago", price: 6200 }, [cite: 157]
                [cite_start]{ id: "avo-tonno", name: "AVO TONNO", description: "Atún, Queso Crema, Cebollín", price: 6400 }, [cite: 157]
                [cite_start]{ id: "avo-like-roll", name: "AVO LIKE ROLL", description: "Salmón, Palmito, Espárrago", price: 6300 }, [cite: 157]
                [cite_start]{ id: "avo-vegetal-panko", name: "AVO VEGETAL PANKO", description: "Cebollín Panko, Queso Crema, Pimentón", price: 5400 }, [cite: 157]
                [cite_start]{ id: "avo-acevichado", name: "AVO ACEVICHADO", description: "Queso Crema, Espárrago, Palmito", price: 7200 } [cite: 157]
            ]
        },
        "cream-rolls": {
            name: "CREAM ROLLS",
            [cite_start]description: "Roll de 8 Cortes de Envuelto en Queso Crema", [cite: 153]
            products: [
                [cite_start]{ id: "cream-kani", name: "CREAM KANI", description: "Kanikama, Palta", price: 5000 }, [cite: 158]
                [cite_start]{ id: "cream-chicken", name: "CREAM CHICKEN", description: "Pollo Teriyaki, Palta, Cebollín", price: 5600 }, [cite: 158]
                [cite_start]{ id: "cream-sake", name: "CREAM SAKE", description: "Salmón, Palta, Ciboulette", price: 6200 }, [cite: 158]
                [cite_start]{ id: "cream-ebi", name: "CREAM EBI", description: "Camarón, Ciboulette, Palta", price: 5800 }, [cite: 158]
                [cite_start]{ id: "tako-snow", name: "TAKO SNOW", description: "Pulpo, Palta, Pimentón", price: 6300 }, [cite: 158]
                [cite_start]{ id: "snow-ebi-panko", name: "SNOW EBI PANKO", description: "Camarón Panko, Palta, Cebollín", price: 6300 }, [cite: 158]
                [cite_start]{ id: "snow-sake-tempura", name: "SNOW SAKE TEMPURA", description: "Salmón Tempura, Espárrago, Pimentón", price: 6400 }, [cite: 158]
                [cite_start]{ id: "snow-yaki-panko", name: "SNOW YAKI PANKO", description: "Pollo Panko, Palta, Cebollín", price: 6100 }, [cite: 158]
                [cite_start]{ id: "snow-tropical", name: "SNOW TROPICAL", description: "Camarón Panko, Mango", price: 6400 }, [cite: 158]
                [cite_start]{ id: "cream-chili", name: "CREAM CHILI", description: "Salmón, Coco/Merquén, Ají Verde, Cebollín", price: 6000 }, [cite: 158]
                [cite_start]{ id: "snow-mix", name: "SNOW MIX", description: "Camarón, Salmón, Palta, Cebollín", price: 6000 }, [cite: 158]
                [cite_start]{ id: "cream-smoke", name: "CREAM SMOKE", description: "Salmón Ahumado, Palta, Cebollín", price: 5700 }, [cite: 158]
                [cite_start]{ id: "cream-like", name: "CREAM LIKE", description: "Masago, Palmito, Palta", price: 5500 }, [cite: 158]
                [cite_start]{ id: "cream-vegetal", name: "CREAM VEGETAL", description: "Palmito, Espárrago, Cebollín", price: 5000 }, [cite: 158]
                [cite_start]{ id: "cream-vegetal-panko", name: "CREAM VEGETAL PANKO", description: "Cebollín Panko, Palta, Pimentón", price: 5100 }, [cite: 158]
                [cite_start]{ id: "tuna-cream", name: "TUNA CREAM", description: "Atún, Palta, Palmito", price: 6100 }, [cite: 158]
                [cite_start]{ id: "cream-acevichado", name: "CREAM ACEVICHADO", description: "Palta, Espárrago, Palmito", price: 6900 } [cite: 158]
            ]
        },
        "tempuras-panko": {
            name: "TEMPURAS/PANKO ROLLS",
            [cite_start]description: "Roll de 8 Cortes Fritos en Tempura y Panko", [cite: 154]
            products: [
                [cite_start]{ id: "kani-panko", name: "KANI PANKO", description: "Kanikama, Queso Crema, Pimentón", price: 5300 }, [cite: 159]
                [cite_start]{ id: "chicken-panko", name: "CHICKEN PANKO", description: "Pollo Teriyaki, Queso Crema, Cebollín", price: 5800 }, [cite: 159]
                [cite_start]{ id: "sake-panko", name: "SAKE PANKO", description: "Salmón, Queso Crema, Ciboulette", price: 6300 }, [cite: 159]
                [cite_start]{ id: "ebi-panko-temp", name: "EBI PANKO", description: "Camarón, Queso Crema, Cebollín", price: 5900 }, [cite: 159]
                [cite_start]{ id: "tako-panko-temp", name: "TAKO PANKO", description: "Pulpo, Queso Crema, Ciboulette", price: 6500 }, [cite: 159]
                [cite_start]{ id: "vegetal-panko-temp", name: "VEGETAL PANKO", description: "Espárrago, Pimentón, Palta", price: 5400 }, [cite: 159]
                [cite_start]{ id: "smoke-panko-temp", name: "SMOKE PANKO", description: "Salmón Ahumado, Queso Crema, Cebollín", price: 5900 }, [cite: 159]
                [cite_start]{ id: "mix-panko-temp", name: "MIX PANKO", description: "Camarón, Salmón, Queso Crema, Cebollín", price: 6500 }, [cite: 159]
                [cite_start]{ id: "vegan-panko-temp", name: "VEGAN PANKO", description: "Palta, Tomate Cherry, Choclo Baby", price: 5500 }, [cite: 159]
                [cite_start]{ id: "chicken-nuss-panko", name: "CHICKEN NUSS PANKO", description: "Pollo Teriyaki, Queso Crema, Nueces/Almendras", price: 6100 }, [cite: 159]
                [cite_start]{ id: "ebi-panko-2-0", name: "EBI PANKO 2.0", description: "Camarón, Queso Crema, Palta", price: 6300 }, [cite: 159]
                [cite_start]{ id: "sea-bomb", name: "SEA BOMB", description: "Camarón, Salmón, Pulpo, Queso Crema, Ciboulette", price: 7000 }, [cite: 159]
                [cite_start]{ id: "chicken-panko-2-0", name: "CHICKEN PANKO 2.0", description: "Pollo Teriyaki, Queso Crema, Palta", price: 6200 }, [cite: 159]
                [cite_start]{ id: "maguro-panko", name: "MAGURO PANKO", description: "Atún, Queso Crema, Cebollín", price: 6400 }, [cite: 159]
                [cite_start]{ id: "panko-acevichado", name: "PANKO ACEVICHADO", description: "Queso Crema, Palta", price: 7500 } [cite: 159]
            ]
        },
        "special-rolls": {
            name: "SPECIAL ROLLS",
            [cite_start]description: "Variedades de Rolls. Especialidades de la casa.", [cite: 155]
            products: [
                [cite_start]{ id: "like-ebi-tempura", name: "LIKE EBI TEMPURA", description: "Camarón, Queso Crema, Ciboulette (Envuelto en Tempura, 8 Cortes)", price: 5800 }, [cite: 160]
                [cite_start]{ id: "like-ura-ebi", name: "LIKE URA EBI", description: "Camarón Tempura, Queso Crema, Ají Verde (Envuelto en Masago, 8 Cortes)", price: 6300 }, [cite: 160]
                [cite_start]{ id: "hoso-chicken-panko-special", name: "HOSO CHICKEN PANKO", description: "Pollo Teriyaki, Queso Crema, Cebollín (Envuelto en Nori/Panko, 10 Cortes)", price: 6000 }, [cite: 160]
                [cite_start]{ id: "maki-gray-roll", name: "MAKI GRAY ROLL", description: "Queso Crema, Palta, Pepino (Envuelto en Amapola, 8 Cortes)", price: 4500 }, [cite: 160]
                [cite_start]{ id: "army-smoke-roll", name: "ARMY SMOKE ROLL", description: "Salmón Ahumado, Queso Crema, Palta (Envuelto en Sésamo/Ciboulette, 8 Cortes)", price: 5300 }, [cite: 160]
                [cite_start]{ id: "like-ebi-avo", name: "LIKE EBI AVO", description: "Camarón, Queso Crema, Palmito (Envuelto en Palta, 8 Cortes)", price: 6200 }, [cite: 160]
                [cite_start]{ id: "hoso-nuss", name: "HOSO NUSS", description: "Queso Crema, Nueces/Almendra (Envuelto en Nori/Tempura, 6 Cortes)", price: 4000 }, [cite: 160]
                [cite_start]{ id: "like-avo-chicken", name: "LIKE AVO CHICKEN", description: "Pollo Teriyaki, Queso Crema, Palmito (Envuelto en Palta, 8 Cortes)", price: 6500 }, [cite: 160]
                [cite_start]{ id: "green-tonno-furai", name: "GREEN TONNO FURAI", description: "Atún Panko, Queso Crema (Envuelto en Ciboulette, 8 Cortes)", price: 6200 }, [cite: 160]
                [cite_start]{ id: "ebi-rainbow", name: "EBI RAINBOW", description: "Camarón Panko, Queso Crema, Cebollín (Envuelto en Palta/Salmón, 8 Cortes)", price: 6800 }, [cite: 160]
                [cite_start]{ id: "sake-ebi-grill", name: "SAKE EBI GRILL", description: "Camarón, Queso Crema, Cebollín (Envuelto en Salmón Grillado, 8 Cortes)", price: 6500 }, [cite: 160]
                [cite_start]{ id: "coco-tempura", name: "COCO TEMPURA", description: "Salmón, Queso Crema, Pimentón (Envuelto en Tempura/Coco, 8 Cortes)", price: 6500 }, [cite: 160]
                [cite_start]{ id: "green-mix", name: "GREEN MIX", description: "Salmón, Camarón, Queso Crema (Envuelto en Ciboulette, 8 Cortes)", price: 6400 }, [cite: 160]
                [cite_start]{ id: "chicken-crispy-nuss", name: "CHICKEN CRISPY NUSS", description: "Pollo Teriyaki, Queso Crema Panko, Ciboulette (Envuelto en Nuez/Almendra, 8 Cortes)", price: 6800 } [cite: 160]
            ]
        },
        "rolls-sin-arroz": {
            name: "ROLLS SIN ARROZ",
            [cite_start]description: "Rolls de 8 cortes, 5 ingredientes y sin arroz", [cite: 69, 70]
            products: [
                { id: "vegetal-panko-sr", name: "Vegetal Panko", description: "8 Cortes", price: 0 }, // Precio no especificado en PDF
                { id: "pollo-panko-sr", name: "Pollo Panko", description: "8 Unidades", price: 0 }, // Precio no especificado en PDF
                { id: "salmon-panko-sr", name: "Salmón Panko", description: "8 Unidades", price: 0 } // Precio no especificado en PDF
            ]
        },
        "tablas": {
            name: "TABLAS",
            description: "",
            products: [
                [cite_start]{ id: "tabla-1", name: "TABLA 1", description: "18 Piezas (1 Persona): Cream Chicken (9 Cortes), Maki Kani (9 Cortes). Incluye 1 Soya, 1 Unagui, 2 Palitos.", price: 8490 }, [cite: 16, 17, 37]
                [cite_start]{ id: "tabla-2", name: "TABLA 2", description: "38 Piezas (2 Personas): Avo Sake (8 Cortes), Maki Kani (8 Cortes), Hoso Ebi (6 Cortes), Chicken Panko (8 Cortes), Palta Panko (4 Unidades), Salmon Panko (4 Unidades).", price: 17990 }, [cite: 18, 19, 20, 21, 22, 23, 24]
                [cite_start]{ id: "tabla-3", name: "TABLA 3", description: "72 Piezas (4 Personas): Avo Sake (8 Cortes), Maki Kani (8 Cortes), Cream Chicken (8 Cortes), Futo Sake (10 Cortes), Hoso Ebi (6 Cortes), Chicken Panko (8 Cortes).", price: 29990 }, [cite: 25, 26, 27, 28, 29, 30, 31]
                [cite_start]{ id: "tabla-like", name: "TABLA LIKE", description: "50 Piezas: California Kani (9 Cortes), Avo Chicken (9 Cortes), Hoso Chicken Panko (10 Cortes), Cream Vegetal (9 Cortes), Vegetal Panko (9 Cortes), Pollo Panko (4 Unidades).", price: 20990 }, [cite: 71, 72, 76, 78, 80, 82]
                [cite_start]{ id: "tabla-hot", name: "TABLA HOT", description: "34 Piezas: (Variedad de Rolls envueltos en Palta, Queso Crema, Salmón, Panko con ingredientes diversos como Salmón, Camarón, Pollo, Palta, Palmito, Pimentón, Cebollín, Nueces, Masago, Choclo Baby Panko).", price: 18990 }, [cite: 85, 92, 97, 98, 102, 107]
                [cite_start]{ id: "tabla-vegan", name: "TABLA VEGAN", description: "32 Piezas: California Vegetal (8 Cortes), Vegan Panko (8 Cortes), Avo Fresh (8 Cortes), Ura Vegan (envuelto en amapola) (8 Unidades).", price: 14990 } [cite: 112, 113, 114, 115, 116]
            ]
        },
        "super-promos": {
            name: "SUPER PROMOS",
            [cite_start]description: "Las Super Promos NO TIENEN CAMBIO.", [cite: 56]
            products: [
                [cite_start]{ id: "super-1", name: "SUPER 1", description: "30 piezas: 1 Pollo Teriyaki - Queso Crema - Cebollín (Env. Palta), 1 Kanikama - Palta Pimentón (Env. Sésamo), 1 Camarón - Queso Crema - Palta (Panko). Incluye 1 Soya, 1 Unagui, 2 Palitos.", price: 12990 }, [cite: 33, 34, 35, 36, 37]
                [cite_start]{ id: "super-2", name: "SUPER 2", description: "50 piezas: 1 Pollo Teriyaki - Queso Crema - Cebollín (Env. Palta), 1 Kanikama - Palta - Pimentón (Env. Sésamo), 1 Pollo Teriyaki - Queso Crema - Cebollín (Env. Amapola), 1 Camarón - Queso Crema - Palta (Panko), 1 Palta-Palmito - Pimentón (Panko). Incluye 2 Soya, 1 Unagui, 3 Palitos.", price: 18990 }, [cite: 38, 39, 40, 41, 42, 43, 44, 45]
                [cite_start]{ id: "super-3", name: "SUPER 3", description: "70 piezas: 1 Pollo Teriyaki - Queso Crema - Cebollín (Env. Palta), 1 Kanikama - Palta Pimentón (Env. Sésamo), 1 Pollo Teriyaki - Queso Crema - Cebollín (Env. Amapola), 1 Palmito - Espárrago - Cebollín (Env. Queso Crema), 1 Camarón - Queso Crema - Palta (Panko), 1 Palta-Palmito - Pimentón (Panko), 1 Pollo Teriyaki - Queso Crema - Cebollín (Panko). Incluye 3 Soya, 2 Unagui, 4 Palitos.", price: 25990 } [cite: 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]
            ]
        },
        "gohan": {
            name: "GOHAN",
            description: "",
            products: [
                [cite_start]{ id: "gohan-mixto", name: "GOHAN MIXTO", description: "", price: 6990 }, [cite: 74, 75]
                [cite_start]{ id: "gohan-mixto-panko", name: "GOHAN MIXTO PANKO", description: "", price: 7990 }, [cite: 81]
                [cite_start]{ id: "gohan-pollo", name: "GOHAN POLLO", description: "", price: 6990 }, [cite: 81]
                [cite_start]{ id: "gohan-pollo-panko", name: "GOHAN POLLO PANKO", description: "", price: 7990 }, [cite: 81]
                [cite_start]{ id: "gohan-vegetal", name: "GOHAN VEGETAL", description: "", price: 5490 } [cite: 83, 84]
            ]
        },
        "sashimi": {
            name: "SASHIMI",
            description: "",
            products: [
                [cite_start]{ id: "sashimi-salmon-3", name: "SALMÓN (3 Cortes)", description: "", price: 2800 }, [cite: 99, 100]
                [cite_start]{ id: "sashimi-salmon-6", name: "SALMÓN (6 Cortes)", description: "", price: 5000 }, [cite: 99, 100]
                [cite_start]{ id: "sashimi-salmon-12", name: "SALMÓN (12 Cortes)", description: "", price: 9000 }, [cite: 99, 101]
                [cite_start]{ id: "sashimi-pulpo-3", name: "PULPO (3 Cortes)", description: "", price: 3400 }, [cite: 103, 104]
                [cite_start]{ id: "sashimi-pulpo-6", name: "PULPO (6 Cortes)", description: "", price: 6000 }, [cite: 103, 104]
                [cite_start]{ id: "sashimi-pulpo-12", name: "PULPO (12 Cortes)", description: "", price: 10500 } [cite: 103, 105]
            ]
        },
        "snacks-tempurizados": {
            name: "SNACKS TEMPURIZADOS",
            description: "",
            products: [
                [cite_start]{ id: "salmon-panko-snack-3", name: "SALMÓN PANKO (3 Unds.)", description: "", price: 3000 }, [cite: 119, 120]
                [cite_start]{ id: "salmon-panko-snack-6", name: "SALMÓN PANKO (6 Unds.)", description: "", price: 5500 }, [cite: 119, 120]
                [cite_start]{ id: "salmon-panko-snack-12", name: "SALMÓN PANKO (12 Unds.)", description: "", price: 9900 }, [cite: 119, 121]
                [cite_start]{ id: "ebi-temp-3", name: "EBI Temp. (3 Unds.)", description: "", price: 2900 }, [cite: 122, 123]
                [cite_start]{ id: "ebi-temp-6", name: "EBI Temp. (6 Unds.)", description: "", price: 5400 }, [cite: 122, 124]
                [cite_start]{ id: "ebi-temp-12", name: "EBI Temp. (12 Unds.)", description: "", price: 9800 }, [cite: 122, 125]
                [cite_start]{ id: "pollo-temp-3", name: "POLLO PANKO (3 Unds.)", description: "", price: 2800 }, [cite: 126, 127]
                [cite_start]{ id: "pollo-temp-6", name: "POLLO PANKO (6 Unds.)", description: "", price: 4900 }, [cite: 126, 128]
                [cite_start]{ id: "pollo-temp-12", name: "POLLO PANKO (12 Unds.)", description: "", price: 9000 }, [cite: 126, 129]
                [cite_start]{ id: "verduras-temp-3", name: "VERDURAS Temp. (3 Unds.)", description: "", price: 2000 }, [cite: 131, 132]
                [cite_start]{ id: "verduras-temp-6", name: "VERDURAS Temp. (6 Unds.)", description: "", price: 3600 }, [cite: 131, 132]
                [cite_start]{ id: "verduras-temp-12", name: "VERDURAS Temp. (12 Unds.)", description: "", price: 6800 } [cite: 131, 132]
            ]
        },
        "nigiris": {
            name: "NIGIRIS",
            description: "",
            products: [
                [cite_start]{ id: "nigiri-salmon", name: "SALMÓN", description: "", price: 1000 }, [cite: 136]
                [cite_start]{ id: "nigiri-camaron", name: "CAMARÓN", description: "", price: 1000 }, [cite: 138]
                [cite_start]{ id: "nigiri-kanikama", name: "KANIKAMA", description: "", price: 900 } [cite: 140]
            ]
        },
        "nigiris-crispy": {
            name: "NIGIRIS CRISPY",
            [cite_start]description: "Mezcla de arroz, Queso Crema, Cebollín, Pollo, Kanikama", [cite: 141, 142, 146]
            products: [
                [cite_start]{ id: "nigiri-crispy-14", name: "14 UNIDADES", description: "", price: 4290 } [cite: 137, 139]
            ]
        },
        "bebidas": {
            name: "BEBIDAS",
            description: "",
            products: [
                [cite_start]{ id: "coca-cola", name: "Coca Cola", description: "", price: 2700 }, [cite: 143, 144]
                [cite_start]{ id: "sprite", name: "Sprite", description: "", price: 2700 }, [cite: 143, 144]
                [cite_start]{ id: "fanta", name: "Fanta", description: "", price: 2700 }, [cite: 143, 145]
                [cite_start]{ id: "coca-zero", name: "Coca Zero", description: "", price: 2700 } [cite: 143, 145]
            ]
        },
        "extras": {
            name: "EXTRAS",
            description: "",
            products: [
                [cite_start]{ id: "salsa-soya", name: "Salsa Soya", description: "", price: 500 }, [cite: 118]
                [cite_start]{ id: "salsa-unagui", name: "Salsa Unagui", description: "", price: 900 }, [cite: 118]
                [cite_start]{ id: "jengibre", name: "Jengibre", description: "", price: 400 }, [cite: 118]
                [cite_start]{ id: "ayuda-palitos", name: "Ayuda Palitos", description: "", price: 400 }, [cite: 118]
                [cite_start]{ id: "sriracha", name: "Sriracha", description: "", price: 500 }, [cite: 118]
                [cite_start]{ id: "wasabi", name: "Wasabi", description: "", price: 400 }, [cite: 118]
                [cite_start]{ id: "palitos", name: "Palitos", description: "", price: 150 }, [cite: 118]
                [cite_start]{ id: "envoltura-hoja-arroz", name: "Envoltura Hoja de Arroz", description: "", price: 500 }, [cite: 118]
                [cite_start]{ id: "ciboulette-extra", name: "Ciboulette", description: "", price: 500 } [cite: 118]
            ]
        }
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
        return shippingCosts[selectedCommune] || 0;
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        const currentShippingCost = calculateShippingCost();

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

    // --- Renderizar Menú en menu.html ---
    function renderMenu() {
        if (!productsContainer) return;

        productsContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

        for (const categoryKey in menuData) {
            const category = menuData[categoryKey];
            const categorySection = document.createElement('section');
            categorySection.classList.add('menu-category-section');
            categorySection.id = categoryKey; // Para anclar las categorías

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.name;
            categorySection.appendChild(categoryTitle);

            if (category.description) {
                const categoryDescription = document.createElement('p');
                categoryDescription.textContent = category.description;
                categorySection.appendChild(categoryDescription);
            }

            const productListDiv = document.createElement('div');
            productListDiv.classList.add('product-list');

            category.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.dataset.id = product.id;
                productCard.dataset.name = product.name;
                productCard.dataset.price = product.price;

                // Si tuvieras imágenes de producto, aquí iría:
                // productCard.innerHTML += `<img src="images/${product.id}.jpg" alt="${product.name}">`;
                // Por ahora, usamos un placeholder o no la incluimos.
                productCard.innerHTML += `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">$${product.price.toLocaleString('es-CL')}</div>
                    <button class="btn add-to-cart">Añadir al Carrito</button>
                `;
                productListDiv.appendChild(productCard);
            });
            categorySection.appendChild(productListDiv);
            productsContainer.appendChild(categorySection);
        }
    }


    // --- Event Listeners ---

    // Inicializar campos de dirección y pago con valores guardados
    if (deliveryCommuneSelect) {
        deliveryCommuneSelect.value = selectedCommune;
        deliveryCommuneSelect.addEventListener('change', (e) => {
            selectedCommune = e.target.value;
            saveCommuneToLocalStorage();
            renderCart();
        });
    }

    if (deliveryStreetAddressInput) {
        deliveryStreetAddressInput.value = streetAddress;
        deliveryStreetAddressInput.addEventListener('input', (e) => {
            streetAddress = e.target.value;
            saveStreetAddressToLocalStorage();
        });
    }

    if (paymentMethodSelect) {
        paymentMethodSelect.value = selectedPaymentMethod;
        paymentMethodSelect.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value;
            savePaymentMethodToLocalStorage();
        });
    }

    // Evento para añadir productos al carrito (ahora en la página de menú)
    // El 'productsContainer' ahora es '#menu-product-list'
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

    // Eventos para el carrito (en la página carrito.html)
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

            const phoneNumber = "56937248200"; // ¡IMPORTANTE: Reemplaza con tu número de teléfono de WhatsApp (sin + ni espacios)!
            const finalPaymentMethod = selectedPaymentMethod;
            const finalShippingCost = calculateShippingCost();

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

            // Limpiar el carrito y los campos después de enviar el pedido
            cart = [];
            selectedCommune = '';
            streetAddress = '';
            selectedPaymentMethod = '';
            localStorage.removeItem('cart');
            localStorage.removeItem('selectedCommune');
            localStorage.removeItem('streetAddress');
            localStorage.removeItem('selectedPaymentMethod');

            if (deliveryCommuneSelect) deliveryCommuneSelect.value = '';
            if (deliveryStreetAddressInput) deliveryStreetAddressInput.value = '';
            if (paymentMethodSelect) paymentMethodSelect.value = '';
            saveCart();
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

    // Inicializar:
    updateCartCount();
    // Renderizar el menú solo si estamos en la página del menú
    if (productsContainer) { // Esto verifica si el elemento #menu-product-list existe
        renderMenu();
    }
    // Renderizar el carrito (siempre se llama para mantener el contador y el estado del carrito actualizados)
    renderCart();

    // Rellenar la comuna y dirección si existen en el localStorage al cargar cualquier página
    if (deliveryCommuneSelect) {
        deliveryCommuneSelect.value = selectedCommune;
    }
    if (deliveryStreetAddressInput) {
        deliveryStreetAddressInput.value = streetAddress;
    }
    if (paymentMethodSelect) {
        paymentMethodSelect.value = selectedPaymentMethod;
    }
});
