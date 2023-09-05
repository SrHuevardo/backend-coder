import { Router } from 'express';
import {
	product,
	products,
	insertProduct,
	editProduct,
	eraseProduct,
} from '../controllers/products.controller.js';

import roleAuth from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', products);
router.get('/:pid', product);
router.post('/', roleAuth('admin'), insertProduct);
router.put('/:pid', roleAuth('admin'), editProduct);
router.delete('/:pid', roleAuth('admin'), eraseProduct);

export default router;