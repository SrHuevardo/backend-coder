import twilio from "twilio";
import config from '../config/environment.config.js';

const ACCOUNT_SID = config.ACCOUNT_SID;
const AUTH_TOKEN = config.AUTH_TOKEN;
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendMessage = async (ticket) => {
	try {
		const userPhone = ticket.purchaser.phone;
		if(!userPhone) return `User doesn't have a phone to send the message.`

		const orderCode = ticket.code;
		const orderAmount = ticket.amount;

		await client.messages.create({
			body: `Your order was processed. Order code: ${orderCode}. Total: $${orderAmount}.`,
			from: "+13343848389",
			to: userPhone
		});
		return;
	} catch (err) {
		return `${err}`
	}
}

export default sendMessage;



