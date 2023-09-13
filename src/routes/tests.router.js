import { Router } from 'express';
import logger from '../utils/logger.util.js';

const router = Router();

router.get('/logs', (req, res) => {
	logger.fatal('Fatal log');
	logger.error('Error log');
	logger.warn('Warn log');
	logger.info('Info log');
	logger.http('HTTP log');
	logger.debug('Debug log');
	return res.status(200).json({ status: 'success', message: 'Logs printed' });
});

router.get('/operation/simple', (req, res) => {
  console.log("entro")
	let result = 0;
	for (let i = 0; i < 1000000; i++) {
		result += 1;
	}
	return res.status(200).json({ status: 'success', result });
});

router.get('/operation/complex', (req, res) => {
	let result = 0;
	for (let i = 0; i < 5e8; i++) {
		result += 1;
	}
	return res.status(200).json({ status: 'success', result });
});

export default router;