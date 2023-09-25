//-----------------------------------------------------------------------------------------
/** Jonathan Morales Comision: 55575 - 3er Entregable programacion Backend Coderhouse */
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

    // getProducts() {
    //     return this.products;
    // }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log(('Todos los campos son obligatorios!!! Solo se mostrará la instancia que contenga todos los campos.').toUpperCase());
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
            thumbnail,
            code,
            stock
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

    // getProductById(idProduct) {
    //     const product = this.products.find(product => product.id === idProduct);

    //     if (!product) {
    //         console.log('Producto no encontrado!!!');
    //         return;
    //     }

    //     console.log(('El producto fue encontrado exitosamente:').toUpperCase());
    //     console.log(product);
    // }

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

const manager = new ProductManager('productos.json');

manager.addProduct(
    'Keyboard',
    'Esta es una descripción muy básica de la PRIMERA instancia de la clase ProductManager',
    1000,
    'https://www.google.com/imgres?imgurl',
    'PROD-001',
    10
);

manager.addProduct(
    'Screen',
    'Esta es una descripción muy básica de la SEGUNDA instancia de la clase ProductManager',
    5500,
    'https://www.google.com/imgres?imgurl',
    'PROD-002',
    7
);

manager.addProduct(
    'Headsets',
    'Esta es una descripción muy básica de la TERCERA instancia de la clase ProductManager',
    2000,
    'https://www.google.com/imgres?imgurl',
    'PROD-003',
    15
);

manager.addProduct(
    'Mouse',
    'Esta es una descripción muy básica de la CUARTA instancia de la clase ProductManager',
    1500,
    'https://www.google.com/imgres?imgurl',
    'PROD-004',
    20
);

manager.getProductById(3);

// Actualizar un producto
manager.updateProduct(1, {
    price: 400,
    stock: 20
});

// Eliminar un producto
manager.deleteProduct(); //Introduce el numero de un id existente para que sea eliminado.

console.log(manager.getProducts());


module.exports = ProductManager;
