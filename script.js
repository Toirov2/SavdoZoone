 const products = [
            { id: 1, name: 'Non', price: 2000, img: 'https://via.placeholder.com/150?text=Non', category: 'oziq', vendor: 'Mahalliy Nonvoyxona', vendorAddress: 'Chilanzar, Toshkent' },
            { id: 2, name: 'Sut', price: 15000, img: 'https://via.placeholder.com/150?text=Sut', category: 'oziq', vendor: 'Sut Mahsulotlari', vendorAddress: 'Yunusobod, Toshkent' },
            { id: 3, name: 'Guruch', price: 15000, img: 'https://via.placeholder.com/150?text=Guruch', category: 'oziq', vendor: 'Oziq-ovqat Do‘koni', vendorAddress: 'Sergeli, Toshkent' },
            { id: 4, name: 'Yog‘', price: 8000, img: 'https://via.placeholder.com/150?text=Yog', category: 'oziq', vendor: 'Oziq-ovqat Do‘koni', vendorAddress: 'Mirobod, Toshkent' },
            { id: 5, name: 'Cola 1L', price: 12000, img: 'https://via.placeholder.com/150?text=Cola', category: 'oziq', vendor: 'Ichimliklar Do‘koni', vendorAddress: 'Yakkasaroy, Toshkent' },
            { id: 6, name: 'Tuxum (10 dona)', price: 18000, img: 'https://via.placeholder.com/150?text=Tuxum', category: 'oziq', vendor: 'Fermer Xo‘jaligi', vendorAddress: 'Bektemir, Toshkent' },
            { id: 7, name: 'Erkaklar uchun shortlar, paxta mato', price: 180000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOVaJb43eSP3jWyPfdAs2yp0CCMKlJ6Krbjew&s', category: 'kiyimlar', vendor: 'Kiyimlar Do‘koni', vendorAddress: 'Chilanzar, Toshkent' },
            { id: 8, name: 'Chisburger', price: 25000, img: 'https://via.placeholder.com/150?text=Chisburger', category: 'ovqatlar', vendor: 'KFC', vendorAddress: 'Yunusobod, Toshkent, KFC filiali' }
        ];

        let cart = [];
        let currentCategory = 'all';
        let searchQuery = '';
        let smsCodes = {};
        let profile = {};

        // Initialize from localStorage
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            profile = JSON.parse(localStorage.getItem('profile')) || {};
            if (profile.name) {
                document.getElementById('profile-name-header').textContent = profile.name;
            }
        } catch (error) {
            console.error('Error parsing localStorage:', error);
            cart = [];
            profile = {};
        }

        const $ = (id) => document.getElementById(id);

        function showSection(sectionId) {
            document.querySelectorAll('section').forEach(section => {
                section.style.display = section.id === sectionId ? 'block' : 'none';
            });
        }

        function searchProducts() {
            searchQuery = $('search-input').value.trim().toLowerCase();
            renderProducts(currentCategory);
        }

        function filterCategory(category) {
            currentCategory = category;
            showSection('products-section');
            renderProducts(category);
            updateNavButtons();
        }

        function updateNavButtons() {
            document.querySelectorAll('nav button').forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('onclick').includes(`'${currentCategory}'`)) {
                    button.classList.add('active');
                }
            });
        }

        function renderProducts(category = 'all') {
            const grid = $('products-grid');
            grid.innerHTML = '';
            let filteredProducts = products.filter(product => 
                category === 'all' || product.category === category
            );

            if (searchQuery) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchQuery)
                );
            }

            filteredProducts = filteredProducts.slice(0, 6);

            if (filteredProducts.length === 0) {
                grid.innerHTML = '<p id="products-text">Mahsulot topilmadi</p>';
            } else {
                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img src="${product.img}" alt="${product.name}" loading="lazy">
                        <h4>${product.name}</h4>
                        <p>${product.price.toLocaleString()} so‘m</p>
                        <button onclick="addToCart(${product.id})" aria-label="${product.name} ni savatga qo‘shish">Qo‘shish</button>
                    `;
                    grid.appendChild(productCard);
                });
            }
        }

        function addToCart(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, quantity: 1 });
            }
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Cart saqlashda xato:', error);
            }
            updateCart();
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.classList.add('shake');
            setTimeout(() => cartIcon.classList.remove('shake'), 300);
            alert(`${product.name} savatga qo‘shildi`);
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Cart saqlashda xato:', error);
            }
            updateCart();
        }

        function updateCartItemQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity = Math.max(1, item.quantity + change);
                try {
                    localStorage.setItem('cart', JSON.stringify(cart));
                } catch (error) {
                    console.error('Cart saqlashda xato:', error);
                }
                updateCart();
            }
        }

        function renderCartItems(containerId) {
            const container = $(containerId);
            container.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return;
                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.className = containerId === 'cart-items' ? 'cart-item' : '';
                cartItem.innerHTML = `
                    ${containerId === 'cart-items' ? `<img src="${product.img}" alt="${product.name}" loading="lazy">` : ''}
                    <span>${product.name} x${item.quantity}</span>
                    <span>${itemTotal.toLocaleString()} so‘m</span>
                    ${containerId === 'cart-items' ? `
                        <div class="quantity-controls">
                            <button onclick="updateCartItemQuantity(${item.id}, -1)" aria-label="${product.name} miqdorini kamaytirish">-</button>
                            <button onclick="updateCartItemQuantity(${item.id}, 1)" aria-label="${product.name} miqdorini ko‘paytirish">+</button>
                            <button class="delete" onclick="removeFromCart(${item.id})" aria-label="${product.name} ni savatdan o‘chirish">O‘chirish</button>
                        </div>
                    ` : ''}
                `;
                container.appendChild(cartItem);
            });

            return { total };
        }

        function updateCart() {
            const { total } = renderCartItems('cart-items');
            $('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            $('cart-total').textContent = `Jami: ${total.toLocaleString()} so‘m`;
            $('proceed-to-checkout').disabled = cart.length === 0;
            renderCartItems('order-summary');
        }

        function generateOrderId() {
            return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        function sendSMSCode(phoneInputId, smsErrorId) {
            const phone = $(phoneInputId).value.trim();
            const errorElement = $(smsErrorId.replace('-sms-error', '-error'));

            if (!/^\+998\d{9}$/.test(phone)) {
                errorElement.textContent = 'Telefon raqami +998 bilan boshlanishi va 9 raqamdan iborat bo‘lishi kerak';
                return;
            }

            errorElement.textContent = '';
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            smsCodes[phoneInputId] = code;
            alert(`SMS kod ${phone} ga yuborildi: ${code}`);
        }

        function verifySMSCode(phoneInputId, smsInputId, smsErrorId) {
            const inputCode = $(smsInputId).value.trim();
            const expectedCode = smsCodes[phoneInputId];
            if (!inputCode || inputCode !== expectedCode) {
                $(smsErrorId).textContent = 'SMS kodi noto‘g‘ri';
                return false;
            }
            $(smsErrorId).textContent = '';
            return true;
        }

        function validateCardNumber(cardNumber) {
            const cleanCardNumber = cardNumber.replace(/\s+/g, '');
            if (!/^\d{16}$/.test(cleanCardNumber)) {
                return { valid: false, error: 'Karta raqami 16 raqamdan iborat bo‘lishi kerak' };
            }

            const cardPatterns = [
                { name: 'UzCard', pattern: /^8600/ },
                { name: 'Humo', pattern: /^(9860|4026)/ },
                { name: 'Visa', pattern: /^4/ },
                { name: 'Mastercard', pattern: /^(5[1-5]|2[2-7])/ }
            ];

            const isValidCard = cardPatterns.some(card => card.pattern.test(cleanCardNumber));
            if (!isValidCard) {
                return { valid: false, error: 'Karta raqami noto‘g‘ri' };
            }

            return { valid: true, error: '' };
        }

        function validateCardDetails() {
            const cardNumber = $('card-number').value.trim();
            const cardExpiry = $('card-expiry').value.trim();
            const cardCvv = $('card-cvv').value.trim();
            let isValid = true;

            const cardNumberValidation = validateCardNumber(cardNumber);
            if (!cardNumberValidation.valid) {
                $('card-number-error').textContent = cardNumberValidation.error;
                isValid = false;
            } else {
                $('card-number-error').textContent = '';
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
                $('card-expiry-error').textContent = 'Amal qilish muddati MM/YY formatida bo‘lishi kerak';
                isValid = false;
            } else {
                const [month, year] = cardExpiry.split('/');
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    $('card-expiry-error').textContent = 'Karta muddati o‘tgan';
                    isValid = false;
                } else {
                    $('card-expiry-error').textContent = '';
                }
            }

            if (!/^\d{3,4}$/.test(cardCvv)) {
                $('card-cvv-error').textContent = 'CVV 3 yoki 4 raqamdan iborat bo‘lishi kerak';
                isValid = false;
            } else {
                $('card-cvv-error').textContent = '';
            }

            return { isValid, cardNumber, cardExpiry, cardCvv };
        }

        function toggleCardInput() {
            const paymentMethod = $('payment-method').value;
            $('card-details').style.display = paymentMethod === 'card' ? 'block' : 'none';
        }

        function saveProfile() {
            const name = $('name').value.trim();
            const surname = $('surname').value.trim();
            const phone = $('phone').value.trim();
            const address = $('address').value;

            $('name-error').textContent = name ? '' : 'Ism kiritilishi shart';
            $('surname-error').textContent = surname ? '' : 'Familiya kiritilishi shart';
            $('phone-error').textContent = /^\+998\d{9}$/.test(phone) ? '' : 'Telefon raqami +998 bilan boshlanishi kerak';
            $('address-error').textContent = address ? '' : 'Tuman tanlang';

            const isSMSValid = verifySMSCode('phone', 'phone-sms', 'phone-sms-error');

            if (!name || !surname || !/^\+998\d{9}$/.test(phone) || !address || !isSMSValid) {
                return;
            }

            profile = { name, surname, phone, address };
            try {
                localStorage.setItem('profile', JSON.stringify(profile));
                $('profile-name-header').textContent = name;
                alert('Profil muvaffaqiyatli saqlandi');
                showSection('products-section');
            } catch (error) {
                console.error('Profil saqlashda xato:', error);
            }
        }

        function submitOrder() {
            const name = $('name-checkout').value.trim();
            const surname = $('surname-checkout').value.trim();
            const phone = $('phone-checkout').value.trim();
            const address = $('address-checkout').value;
            const paymentMethod = $('payment-method').value;
            const termsAgreed = $('terms-agree').checked;

            $('name-checkout-error').textContent = name ? '' : 'Ism kiritilishi shart';
            $('surname-checkout-error').textContent = surname ? '' : 'Familiya kiritilishi shart';
            $('phone-checkout-error').textContent = /^\+998\d{9}$/.test(phone) ? '' : 'Telefon raqami +998 bilan boshlanishi kerak';
            $('address-checkout-error').textContent = address ? '' : 'Tuman tanlang';
            $('payment-method-error').textContent = paymentMethod ? '' : 'To‘lov usulini tanlang';
            $('terms-agree-error').textContent = termsAgreed ? '' : 'Shartlarga rozilik berish shart';

            const isSMSValid = verifySMSCode('phone-checkout', 'phone-checkout-sms', 'phone-checkout-sms-error');

            let cardDetails = { isValid: true };
            if (paymentMethod === 'card') {
                cardDetails = validateCardDetails();
            }

            if (!name || !surname || !/^\+998\d{9}$/.test(phone) || !address || !paymentMethod || !termsAgreed || !isSMSValid || !cardDetails.isValid) {
                return;
            }

            const orderId = generateOrderId();
            const orderDetails = {
                orderId,
                name,
                surname,
                phone,
                address,
                paymentMethod,
                ...(paymentMethod === 'card' && {
                    cardDetails: {
                        cardNumber: cardDetails.cardNumber,
                        cardExpiry: cardDetails.cardExpiry,
                        cardCvv: cardDetails.cardCvv
                    }
                }),
                items: cart,
                total: cart.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.id);
                    return sum + (product ? product.price * item.quantity : 0);
                }, 0)
            };

            let orderSummary = `--- Buyurtma cheki ---\n`;
            orderSummary += `Buyurtma raqami: ${orderId}\n\n`;
            orderSummary += `Mijoz ma'lumotlari:\n`;
            orderSummary += `Ism: ${orderDetails.name}\n`;
            orderSummary += `Familiya: ${orderDetails.surname}\n`;
            orderSummary += `Telefon: ${orderDetails.phone}\n`;
            orderSummary += `Manzil: ${orderDetails.address}\n`;
            orderSummary += `To‘lov usuli: ${orderDetails.paymentMethod === 'cash' ? 'Naqd' : 'Karta'}\n`;
            
            if (orderDetails.paymentMethod === 'card') {
                orderSummary += `Karta raqami: ${orderDetails.cardDetails.cardNumber}\n`;
                orderSummary += `Amal qilish muddati: ${orderDetails.cardDetails.cardExpiry}\n`;
                orderSummary += `CVV: ***\n`;
            }
            
            orderSummary += `\nBuyurtma tafsilotlari:\n`;
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    orderSummary += `${product.name} x${item.quantity} - ${(product.price * item.quantity).toLocaleString()} so‘m\n`;
                    orderSummary += `Sotuvchi: ${product.vendor}\n`;
                    orderSummary += `Manzil: ${product.vendorAddress}\n`;
                }
            });
            orderSummary += `\nJami: ${orderDetails.total.toLocaleString()} so‘m`;

            $('order-code').textContent = `Buyurtma raqami: ${orderId}`;
            $('order-details').textContent = orderSummary;
            $('order-confirmation-modal').style.display = 'flex';

            cart = [];
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Cart saqlashda xato:', error);
            }
            updateCart();
        }

        function closeModal() {
            $('order-confirmation-modal').style.display = 'none';
            showSection('products-section');
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCart();
            updateNavButtons();
        });