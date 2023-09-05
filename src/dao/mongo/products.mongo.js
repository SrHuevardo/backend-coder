import { productModel } from './models/product.model.js';

class ProductsMongoDAO {
	constructor() {}

	async getProductsDao() {
		try {
			const products = await productModel.find();
			if(!products) return `No products found.`
			return products
		} catch (error) {
			return `${error}`;
		}
	}

	async getProductDao(pid) {
		try {
			const product = await productModel.findById(pid);
			if(!product) return `No product found with ID '${pid}'.`
			return product
		} catch (error) {
			return `${error}`;
		}
	}

	async createProductDao(product) {
		try {
			const newProduct = await productModel.create(product);
			if(!newProduct) return `No product was created.`
			return newProduct
		} catch (error) {
			return `${error}`;
		}
	}

	async updateProductDao(pid, product) {
		try {
			const productToModify = await productModel.findById(pid);
			if(!productToModify) return `No product found with ID '${pid}'.`
			await productModel.updateOne({ _id: pid }, product);
			const updatedProduct = await productModel.findById(pid);
			return updatedProduct;
		} catch (error) {
			return `${error}`;
		}
	}

	async deleteProductDao(pid) {
		try {
			const product = await productModel.findById(pid);
			if(!product) return `No product found with ID '${pid}'.`

			await productModel.deleteOne({ _id: pid });
			const productDeleted = await productModel.findById(pid);

			if (productDeleted) return `No product was deleted.`
			const products = await productModel.find();
			return products;
		} catch (error) {
			return `${error}`;
		}
	}
}

const MongoDAO = new ProductsMongoDAO();
export default MongoDAO;