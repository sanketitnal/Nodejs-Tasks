var express = require("express");
var router = express.Router();
var validateSignUpData = require("../auth/signup-validator");
var validateSignInData = require("../auth/signin-validator");
var generateAuthToken = require("../auth/auth-token");
var { validationResult } = require("express-validator");
var userDB = require("../auth/userdb");
var cacheDB = require("../cache/cache");
const COOKIE_EXPIRE_TIME = 24 * 60 * 60 * 1000;

/**
 * @swagger
 * /users/signup:
 *  post:
 *    summary: Register new users
 *    description: Register new users. Provide mandatory email, name and password to register.
 *
 *    requestBody:
 *      description: Sigin details
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/signupdet'
 *
 *    responses:
 *      200:
 *        description: Successfully registered.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *      400:
 *        description: In case of invalid name, email or password. Or if the user already exists.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 */

router.post("/signup", validateSignUpData(), function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({
			status: 400,
			message: "Bad request. Please send valid email, password, name",
		});
		return;
	}
	let signUpRes = userDB.signUpUser(req.body);
	if (signUpRes) {
		res.status(signUpRes.status).json(signUpRes);
		return;
	}
	res.status(200).json({
		status: 200,
		message: "Success",
	});
});

/**
 * @swagger
 * /users/signup:
 *  get:
 *    summary: SignUp UI
 *    description: Returns sign up UI. HTML Form.
 *    responses:
 *      200:
 *        description: Returns html data.
 *        content:
 *          text/html
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 */
router.get("/signup", function (req, res, next) {
	//console.log(global.__basedir);
	res.sendFile(global.__basedir + "/public/signup.html");
});

/**
 * @swagger
 * /users/signin:
 *  get:
 *    summary: SignIn UI
 *    description: Returns sign in UI. HTML Form.
 *    responses:
 *      200:
 *        description: Returns html data.
 *        content:
 *          text/html
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 */
router.get("/signin", function (req, res, next) {
	// console.log(global.__basedir);
	res.sendFile(global.__basedir + "/public/signin.html");
});

/**
 * @swagger
 * /users/signin:
 *  post:
 *    summary: SignIn operation
 *    description: SignIn operation. Validates email and password. Assigns AuthToken cookie if successfully signed in.
 *
 *    requestBody:
 *      description: Sigin details
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/signindet'
 *
 *    responses:
 *      200:
 *        description: successfully signed in.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *        headers:
 *          Set-Cookie:
 *            schema:
 *              type: string
 *              example: AuthToken=eeeeeef1123346301d65edd48db9b15ea1700a2aae8eda5a934c64374c3c; HttpOnly; Path=/
 *      400:
 *        description: Invalid email and/or password.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *      401:
 *        description: Wrong email, password combination.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 */
router.post("/signin", validateSignInData(), function (req, res, next) {
	const errors = validationResult(req);
	// console.log(req.body);
	if (!errors.isEmpty()) {
		res.status(400).json({
			status: 400,
			message: "Bad request. Please send valid email and password",
		});
		return;
	}
	if (userDB.signInUser(req.body)) {
		let authToken = generateAuthToken();
		res.cookie("AuthToken", authToken, {
			secure: true,
			httpOnly: true,
			expire: new Date() + COOKIE_EXPIRE_TIME,
		});
		cacheDB.addKV(authToken, req.body.email);
		res.status(200).json({
			status: 200,
			message: "Success",
		});
	} else {
		res.status(401).json({
			status: 401,
			message: "Wrong email password combination",
		});
		return;
	}
});

/**
 * @swagger
 * /users/signout:
 *  get:
 *    summary: Signout operation
 *    description: SignOut operation. Clears cookie at frontend and backend.
 *    responses:
 *      200:
 *        description: successfully signed out.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/standardresponse'
 */
router.get("/signout", function (req, res, next) {
	let token = req.user && req.user.token;
	cacheDB.removeK(token);
	res.clearCookie("AuthToken");
	res.status(200).json({
		status: 200,
		message: "Success",
	});
});

module.exports = router;
