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
            id: this.carts.length + 1,
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
            productInCart.quantity += 1;
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

//----------------------------------------------------------------------------------------------------------------------------


//Codigo DB (Aun falta por separar)

const mongoose = require('mongoose');
const Cart = require('./CartsModel');

class CartManager {
    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            console.log('Carrito creado exitosamente:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId, quantity: 1 });
            }

            await cart.save();
            console.log('Producto agregado al carrito exitosamente.');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.productId');
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        }
    }
}

function isCartIdValid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    CartManager,
    isCartIdValid
};