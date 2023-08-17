import CustomRouter from './custom.router.js';

export default class CustomUsersRouter extends CustomRouter {
	init() {
		this.get('/', (req, res) => {
			const payload = {
				id: 10,
				name: "Nico",
				age: 23,
			}
			res.sendSuccess(payload);
		});
	};
};