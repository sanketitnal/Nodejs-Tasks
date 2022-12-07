const { body } = require("express-validator");

function validateSignIpData() {
	return [
		body("email").exists().isEmail(),
		body("password").exists().isLength({ min: 8, max: 128 }),
	];
}

module.exports = validateSignIpData;
