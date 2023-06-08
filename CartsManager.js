import fs from "fs";

export default class CartsManager {
	#carts;
	#path;

	constructor(fileName) {
		this.#carts = [];
		this.#path = `${fileName}.json`;
	};

	getCarts() {
		// Validar si existe el archivo:
		if (!fs.existsSync(this.#path)) {
			try {
				// Si no existe, crearlo:
				fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
			} catch (err) {
				return `Error al obtener el carrito: ${err}`;
			};
		};

		// Leer archivo y convertirlo en objeto:
		try {
			const data = fs.readFileSync(this.#path, "utf8");
			const dataArray = JSON.parse(data);
			return dataArray;
		} catch (err) {
			return `Error al leer los carritos: ${err}`;
		};
	};

	lastId() {
		const carts = this.getCarts();

		// Obtener y devolver último ID:
		if (carts.length > 0) {
			const lastId = carts.reduce((maxId, cart) => {
				return cart.id > maxId ? cart.id : maxId;
			}, 0);
			return lastId;
		};

		// Si el array está vacío, devolver 0:
		return 0;
	};

	addCart() {
		try {
			const carts = this.getCarts();
			const id = this.lastId() + 1;
			const newCart = {
				id: id,
				products: []
			};

			// Agregar carrito y escribir el archivo:
			carts.push(newCart);
			fs.writeFileSync(this.#path, JSON.stringify(carts));
		} catch (err) {
			return `Error al crear el carrito: ${err}`;
		};
	};

	getCartById(id) {
		try {
			const carts = this.getCarts();
			const cart = carts.find(cart => cart.id === id);
	
			// Validar si el carrito existe:
			if (!cart) {
				return `No existe un carrito con el ID ${id}`;
			};
			return cart.products;
		} catch (err) {
			return `Error al obtener el carrito ${id}: ${err}`;
		};
	};

	addProductToCart(cartId, productId) {
		try {
			const carts = this.getCarts();
			const cart = carts.find(cart => cart.id === cartId);
			const product = cart.products.find(product => product.product === productId);

			// Validar si el producto ya está agregado:
			if (product) {
				product.quantity += 1;
			} else {
				// Si no, agregarlo:
				const newProduct = {
					product: productId,
					quantity: 1,
				};
				cart.products.push(newProduct);
			};
			fs.writeFileSync(this.#path, JSON.stringify(carts));
		} catch (err) {
			return `Error al añadir el producto ${productId} al carrito ${cartId}: ${err}`;
		};
	};

};