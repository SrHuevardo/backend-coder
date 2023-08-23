import { productModel } from '../dao/mongo/models/product.model.js';
import { cartModel } from '../dao/mongo/models/cart.model.js';
import cartCookie from '../utils/cart.utils.js';

const home = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		return res.status(200).render('home', {
			user: req.session.user,
			style: 'home.css',
			documentTitle: 'Home',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const login = async (req, res) => {
	try {
		if (req.session.user) {
			return res.redirect('/');
		}

		return res.status(200).render('login', {
			style: 'login.css',
			documentTitle: 'Login',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const register = async (req, res) => {
	try {
		if (req.session.user) {
			return res.redirect('/');
		}

		return res.status(200).render('register', {
			style: 'register.css',
			documentTitle: 'Register',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const products = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const cart = await cartCookie(req, res);
		let { limit, page, query, sort } = req.query;

		if (page == undefined || page == '' || page < 1 || isNaN(page)) {
			page = 1;
		}

		if (limit == undefined || limit == '' || limit <= 1 || isNaN(limit)) {
			limit = 10;
		}

		if (
			sort == undefined ||
			(sort !== 'asc' && sort !== 'desc') ||
			!isNaN(sort)
		) {
			sort = 'asc';
		}

		const filter = { category: query };
		const options = {
			page,
			limit,
			customLabels: {
				totalPages: 'totalPages',
				hasPrevPage: 'hasPrevPage',
				hasNextPage: 'hasNextPage',
				prevPage: 'prevPage',
				nextPage: 'nextPage',
				docs: 'data',
			},
			lean: true,
		};

		const products = await productModel.paginate({}, options);
		const filteredProducts = await productModel.paginate(filter, options);

		if (sort === 'asc') {
			filteredProducts.data.sort((a, b) => a.price - b.price);
			products.data.sort((a, b) => a.price - b.price);
		} else {
			filteredProducts.data.sort((a, b) => b.price - a.price);
			products.data.sort((a, b) => b.price - a.price);
		}

		if (products.data.length <= 0) {
			return res.status(400).send(`There's no products for this search`);
		}

		if (filteredProducts.data.length > 0) {
			return res.status(200).render('products', {
				status: 'success',
				payload: filteredProducts.data,
				user: req.session.user,
				page,
				limit,
				query,
				sort,
				cart,
				totalPages: filteredProducts.totalPages,
				hasPrevPage: filteredProducts.hasPrevPage,
				hasNextPage: filteredProducts.hasNextPage,
				prevPage: filteredProducts.prevPage,
				nextPage: filteredProducts.nextPage,
				documentTitle: 'Products',
				style: 'products.css',
			});
		}

		return res.status(200).render('products', {
			status: 'success',
			payload: products.data,
			user: req.session.user,
			page,
			limit,
			query,
			sort,
			cart,
			totalPages: products.totalPages,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			documentTitle: 'Products',
			style: 'products.css',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const product = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const cart = await cartCookie(req, res);
		const { pid } = req.params;
		const product = await productModel.findById(pid).lean();

		return res.status(200).render('product', {
			product,
			cart,
			style: 'product.css',
			documentTitle: 'Product',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const carts = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const { cid } = req.params;
		const cart = await cartModel.findById(cid).populate('products._id').lean();

		if (!cart) {
			return res.status(400).send(`Invalid cart ID ${cid}`);
		}

		return res.status(200).render('carts', {
			style: 'carts.css',
			documentTitle: 'Carts',
			payload: cart.products,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const exclusive = async (req, res) => {
	try {
		return res.status(200).send(`Welcome to exclusive route`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export default {
	login,
	register,
	home,
	products,
	product,
	carts,
	exclusive,
};