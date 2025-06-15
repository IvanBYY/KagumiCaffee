document.addEventListener('DOMContentLoaded', function() {
    const verifyBtn = document.getElementById('verify-btn');
    
    verifyBtn.addEventListener('click', function() {
        // Load data dari localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const customerName = localStorage.getItem('customer_name') || 'Pelanggan';
        
        // Format pesan WhatsApp
        let message = `Halo Kagumi Coffee,\n\n`;
        message += `Saya ${customerName} telah melakukan pembayaran untuk pesanan berikut:\n\n`;
        
        cart.forEach(item => {
            message += `- ${item.name} (${item.quantity}x) Rp${item.price.toLocaleString()}\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal: Rp${total.toLocaleString()}\n\n`;
        message += `Mohon verifikasi pembayaran saya. Terima kasih.`;

        // Buka WhatsApp
        window.open(`https://wa.me/6285702168603?text=${encodeURIComponent(message)}`, '_blank');
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('customer_name');
    });
});