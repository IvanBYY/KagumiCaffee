document.addEventListener('alpine:init', () => {
    Alpine.data('dropdown', () => ({
        selectedCategory: 'all',
        products: [
            { id: 1, name: 'Espresso', category: 'espresso', price: 20000, image: 'image/expresso.jpg' },
            { id: 2, name: 'Americano', category: 'espresso', price: 20000, image: 'image/americano.png' },
            { id: 3, name: 'Cafe Latte', category: 'espresso', price: 25000, image: 'image/expresso.jpg' },
            { id: 4, name: 'Cappucino', category: 'espresso', price: 25000, image: 'image/expresso.jpg' },

            { id: 5, name: 'Caramel Latte', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },
            { id: 6, name: 'Hazelnut Latte', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },
            { id: 7, name: 'Brown Sugar Latte', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },
            { id: 8, name: 'Rum Latte', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },
            { id: 9, name: 'Mochaccino', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },
            { id: 10, name: 'Coffee Oatside', category: 'flavor', price: 28000, image: 'image/expresso.jpg' },

            { id: 11, name: 'Green Tea Latte', category: 'powder', price: 25000, image: 'image/expresso.jpg' },
            { id: 12, name: 'Choco Latte', category: 'powder', price: 25000, image: 'image/expresso.jpg' },

            { id: 13, name: 'Japanese Tea', category: 'tea', price: 20000, image: 'image/expresso.jpg' },
            { id: 14, name: 'Lemon Tea', category: 'tea', price: 25000, image: 'image/expresso.jpg' },
            { id: 15, name: 'Lychee Tea', category: 'tea', price: 25000, image: 'image/expresso.jpg' },
            { id: 16, name: 'Strawberry Tea', category: 'tea', price: 25000, image: 'image/expresso.jpg' },

            { id: 17, name: 'V60', category: 'brew', price: 25000, image: 'image/expresso.jpg' },
            { id: 18, name: 'Aeropress', category: 'brew', price: 25000, image: 'image/expresso.jpg' },
            { id: 19, name: 'Kalita Wave', category: 'brew', price: 25000, image: 'image/expresso.jpg' },
            { id: 20, name: 'Tubruk', category: 'brew', price: 15000, image: 'image/expresso.jpg' },

            { id: 21, name: 'Crispy Casava', category: 'snack', price: 20000, image: 'image/expresso.jpg' },
            { id: 22, name: 'Onion Rings', category: 'snack', price: 20000, image: 'image/expresso.jpg' },
            { id: 23, name: 'Toast', category: 'snack', price: 22000, image: 'image/expresso.jpg' },
            { id: 24, name: 'Mix Platter', category: 'snack', price: 30000, image: 'image/expresso.jpg' },
            { id: 25, name: 'French Fries', category: 'snack', price: 20000, image: 'image/expresso.jpg' },
        ],

        get filteredProducts() {
            if (this.selectedCategory === 'all') return this.products;
            return this.products.filter(p => p.category === this.selectedCategory);
        },

        setCategory(cat) {
            this.selectedCategory = cat;
        },

        // Tambahkan method untuk handle add to cart
        addToCart(product) {
            const event = new CustomEvent('add-to-cart', {
                detail: product,
                bubbles: true
            });
            this.$el.dispatchEvent(event);
        },
        
    }));
        Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,  
        add(newItem) {
            console.log(newItem);
        },
        clear() {  // Tambahkan method clear
            this.items = [];
            this.total = 0;
            this.quantity = 0;
            localStorage.removeItem('cart');
        }
    });
});


//Conversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}