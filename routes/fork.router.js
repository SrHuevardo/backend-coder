import { Router } from "express";
import { fork } from 'child_process';
const forkRouter = Router();

forkRouter.get('/operacion', (req, res) => {
	const child = fork('../utils/operation.utils.js');
	child.send('start');
	child.on('message', (result) => {
		res.json('Result:', result);
	});
});

export default forkRouter;