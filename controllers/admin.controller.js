import { Router } from 'express';
import authorization from './role.controller.js';
import passportCall from '../utils/passportCall.utils.js';

const router = Router();

router.get('/private', passportCall("jwt"), authorization('admin'), (req, res) => {
	res.json({ message: 'Private route' });
});

export default router;