import dotenv from 'dotenv';

dotenv.config();

export default {
	MONGO_URL: process.env.MONGO_URL,
	MONGO_SESSION_SECRET: process.env.MONGO_SESSION_SECRET,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
	COOKIE_SECRET: process.env.COOKIE_SECRET,
	PORT: process.env.PORT,
	HOST: process.env.HOST,
	EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	ACCOUNT_SID: process.env.ACCOUNT_SID,
	AUTH_TOKEN: process.env.AUTH_TOKEN,
};