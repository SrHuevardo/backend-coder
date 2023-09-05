import mongoose from 'mongoose';
import config from "../src/config/environment.config.js"

const mongoUrl = config.MONGO_URL;

const environment = async () => {
	try {
		await mongoose.connect(mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Mongo connected");
	} catch (err) {
		console.log("Mongo error:", err);
	};
};

export default environment;