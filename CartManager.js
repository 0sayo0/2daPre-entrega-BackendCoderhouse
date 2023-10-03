const fs = require('fs');

class CartManager {
    constructor(filePath = 'carrito.json') {
        this.carts = [];
        this.path = filePath;
        this.loadFromFile();
    }

    loadFromFile() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
        }
    }

    saveToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
    }

    createCart() {
        const newCart = {
            id: this.carts.length + 1, // Esto es un simple autogenerador.
            products: []
        };

        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    addProductToCart(cartId, productId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado.');
        }
    
        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1; // Incrementa la cantidad si el producto ya existe
        } else {
            cart.products.push({ product: productId, quantity: 1 }); // Agrega un nuevo producto si no existe
        }

        this.saveToFile();
    }

    getCartById(cartId) {
        this.saveToFile();
        return this.carts.find(cart => cart.id === cartId);
    }
}

function isCartIdValid(id) {
    return !isNaN(parseInt(id)) && isFinite(id);
}

module.exports = {
    CartManager,
    isCartIdValid
};
