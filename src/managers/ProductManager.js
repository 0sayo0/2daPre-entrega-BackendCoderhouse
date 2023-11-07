//-----------------------------------------------------------------------------------------
/** Jonathan Morales Comision: 55575 - 4to Entregable programacion Backend Coderhouse */
//-----------------------------------------------------------------------------------------

const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.path = filePath;
        this.loadFromFile();
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
        }
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar en el archivo:', error);
        }
    }

    async getProducts(limit) {
        try {
            if (limit) {
                return this.products.slice(0, limit);
            } else {
                return this.products;
            }
        } catch (error) {
            throw error;
        }
    }

    addProduct(productData) {
        const { title, description, price, imageUrl, code, stock, category } = productData;

        if (!title || !description || !price || !code || !stock || !category) {
            console.log(('Todos los campos son obligatorios excepto thumbnails.').toUpperCase());
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log('Ya existe un producto con ese código');
            return;
        }

        const product = {
            title,
            description,
            price,
            code,
            stock,
            status: true, // Por defecto es true
            category,
            thumbnails
        };

        if (this.products.length === 0) {
            product.id = 1;
        } else {
            const lastProduct = this.products[this.products.length - 1];
            product.id = lastProduct.id + 1;
        }

        this.products.push(product);
        this.saveToFile();
    }

    async getProductById(idProduct) {
        try {
            const product = this.products.find((product) => product.id === idProduct);
            return product;
        } catch (error) {
            throw error;
        }
    }

    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado!!!');
            return;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedProduct,
            id: this.products[productIndex].id // Mantenemos el ID original
        };

        this.saveToFile();
        console.log('Producto actualizado exitosamente.');
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado!!!');
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveToFile();
        console.log('Producto eliminado exitosamente.');
    }
}

function isProductIdValid(id) {
    return !isNaN(parseInt(id)) && isFinite(id); //Agregado para 1ra pre-entrega
}

const manager = new ProductManager('productos.json');

manager.addProduct({
    title: 'Keyboard',
    description: 'Esta es una descripción muy básica de la PRIMERA instancia de la clase ProductManager',
    price: 1000,
    imageUrl: 'https://www.google.com/imgres?imgurl',
    code: 'PROD-001',
    stock: 10
});

manager.addProduct({
    title: 'Screen',
    description: 'Esta es una descripción muy básica de la SEGUNDA instancia de la clase ProductManager',
    price: 5500,
    imageUrl: 'https://www.google.com/imgres?imgurl',
    code: 'PROD-002',
    stock: 7
});

manager.addProduct({
    title: 'Headsets',
    description: 'Esta es una descripción muy básica de la TERCERA instancia de la clase ProductManager',
    price: 2000,
    imageUrl: 'https://www.google.com/imgres?imgurl',
    code: 'PROD-003',
    stock: 15
});

manager.addProduct({
    title: 'Mouse',
    description: 'Esta es una descripción muy básica de la CUARTA instancia de la clase ProductManager',
    price: 1500,
    imageUrl: 'https://www.google.com/imgres?imgurl',
    code: 'PROD-004',
    stock: 20
});

manager.getProductById(3);

// Actualizar un producto
manager.updateProduct(1, {
    price: 400,
    stock: 20
});

// Eliminar un producto
manager.deleteProduct(); //Introduce el numero de un id existente para que sea eliminado.

console.log(manager.getProducts());


module.exports = {
    ProductManager,
    isProductIdValid
};

//-----------------------------------------------------------------------------------------------------------


//Codigo DB (Aun falta por separar)

const mongoose = require('mongoose');
const Product = require('../ProductsModel');

class ProductManager {
    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            console.log('Producto agregado exitosamente:', product);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    async getProducts(limit) {
        try {
            const products = await Product.find().limit(limit);
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(idProduct) {
        try {
            const product = await Product.findById(idProduct);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            await Product.findByIdAndUpdate(id, updatedProduct);
            console.log('Producto actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id);
            console.log('Producto eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}

function isProductIdValid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    ProductManager,
    isProductIdValid
};