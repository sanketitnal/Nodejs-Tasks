const { body } = require("express-validator");

function validateSignUpData() {
	return [
		body("name").exists().isLength({ min: 3, max: 128 }),
		body("email").exists().isEmail(),
		body("password").exists().isLength({ min: 8, max: 128 }),
	];
}

module.exports = validateSignUpData;
