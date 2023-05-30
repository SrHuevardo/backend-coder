import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  // Cargar los productos desde el archivo al arreglo de productos
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  // Guardar los productos del arreglo al archivo
  saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      writeFileSync(this.path, data, 'utf8');
      //console.log('Productos guardados correctamente.'); no es necesario que se muestre en este ejercicio
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  }

  // Agregar un nuevo producto al arreglo
  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos del producto son obligatorios.');
      return;
    }

    // Validar que no se repita el campo "code"
    const isCodeDuplicate = this.products.some(p => p.code === product.code);
    if (isCodeDuplicate) {
      console.error('Ya existe un producto con el mismo código.');
      return;
    }

    // Asignar un ID autoincrementable al producto
    const id = this.products.length + 1;
    const newProduct = { id, ...product };
    this.products.push(newProduct);

    this.saveProducts();
    //console.log('Producto agregado correctamente.'); no es necesario que se muestre en este ejercicio
  }

  // Obtener todos los productos del arreglo
  getProducts() {
    try {
      const data = readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  // Obtener un producto por su ID
  getProductById(id) {
    try {
      const products = this.getProducts();
      const product = products.find(p => p.id == id);
      return product || null;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  // Actualizar un producto por su ID
  updateProduct(id, updatedFields) {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        console.error('No se encontró el producto con el ID especificado.');
        return;
      }
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;
      this.products = products;
      this.saveProducts();
      console.log('Producto actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  }

  // Eliminar un producto por su ID
  deleteProduct(id) {
    try {
      const products = this.getProducts();
      const updatedProducts = products.filter(p => p.id !== id);
      if (updatedProducts.length === products.length) {
        console.error('No se encontró el producto con el ID especificado.');
        return;
      }
      this.products = updatedProducts;
      this.saveProducts();
      console.log('Producto eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }
}



// Ejemplo de uso
const productManager = new ProductManager('products.json');


// Agregar un nuevo producto

const newProduct1 = {
  title: 'Nuevo producto 1',
  description: 'Descripción del nuevo producto 1',
  price: 10,
  thumbnail: 'ruta-de-imagen1',
  code: 'ABC1234',
  stock: 5
};

const newProduct2 = {
    title: 'Nuevo producto 2',
    description: 'Descripción del nuevo producto 2',
    price: 20,
    thumbnail: 'ruta-de-imagen2',
    code: 'ABC1235',
    stock: 10
};

const newProduct3 = {
  title: 'Nuevo producto 3',
  description: 'Descripción del nuevo producto 3',
  price: 30,
  thumbnail: 'ruta-de-imagen3',
  code: 'ABC1236',
  stock: 15
};

const newProduct4 = {
    title: 'Nuevo producto 4',
    description: 'Descripción del nuevo producto 4',
    price: 40,
    thumbnail: 'ruta-de-imagen4',
    code: 'ABC1237',
    stock: 20
  };

const newProduct5 = {
      title: 'Nuevo producto 5',
      description: 'Descripción del nuevo producto 5',
      price: 50,
      thumbnail: 'ruta-de-imagen5',
      code: 'ABC1238',
      stock: 5
};

const newProduct6 = {
    title: 'Nuevo producto 6',
    description: 'Descripción del nuevo producto 6',
    price: 10,
    thumbnail: 'ruta-de-imagen6',
    code: 'ABC1239',
    stock: 5
};

const newProduct7 = {
    title: 'Nuevo producto 7',
    description: 'Descripción del nuevo producto 7',
    price: 10,
    thumbnail: 'ruta-de-imagen7',
    code: 'ABC12310',
    stock: 5
};
const newProduct8 = {
      title: 'Nuevo producto 8',
      description: 'Descripción del nuevo producto 8',
      price: 10,
      thumbnail: 'ruta-de-imagen8',
      code: 'ABC12311',
      stock: 5
};

const newProduct9 = {
    title: 'Nuevo producto 9',
    description: 'Descripción del nuevo producto 9',
    price: 10,
    thumbnail: 'ruta-de-imagen9',
    code: 'ABC12312',
    stock: 5
};

const newProduct10 = {
    title: 'Nuevo producto 10',
    description: 'Descripción del nuevo producto 10',
    price: 10,
    thumbnail: 'ruta-de-imagen10',
    code: 'ABC12313',
    stock: 5
};
productManager.addProduct(newProduct1);
productManager.addProduct(newProduct2);
productManager.addProduct(newProduct3);
productManager.addProduct(newProduct4);
productManager.addProduct(newProduct5);
productManager.addProduct(newProduct6);
productManager.addProduct(newProduct7);
productManager.addProduct(newProduct8);
productManager.addProduct(newProduct9);
productManager.addProduct(newProduct10);

