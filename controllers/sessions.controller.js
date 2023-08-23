const login = async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		return res.status(200).send({status: 'success', response: 'User loged'});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

const loginjwt = async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		const access_token = generateToken(user);
		return res.status(200).send({ status: 'success', token: access_token });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const register = async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		return res
			.status(200)
			.send({ status: 'success', response: 'User created' });
	} catch (err) {
		return res.status(500).json({ status: 'error', response: err.message });
	}
};

const logout = async (req, res) => {
	try {
		req.session.destroy((err) => {
			if (!err) {
				return res.redirect("/")
				// return res.status(200).render('login', {
				// 	style: 'login.css',
				// 	documentTitle: 'Login',
				// });
			}

			return res.status(500).send({ status: `Logout error`, payload: err });
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const current = async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		return res
			.status(200)
			.send({ status: 'success', response: 'User created' });
	} catch (err) {
		return res.status(500).json({ status: 'error', response: err.message });
	}
};

const github = async (req, res) => {}

const githubCallback = async (req, res) => {
	req.session.user = req.user;
	res.redirect('/');
}

export default {
	login,
	loginjwt,
	register,
	logout,
	current,
	github,
	githubCallback,
};