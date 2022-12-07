const supertest = require("supertest");
const assert = require("assert");
const app = require("../app.js");

const URL = "/users/signin";

describe(`POST ${URL}`, function () {
	it("it should have status code 400 when sending bad request", function (done) {
		supertest(app)
			.post(URL)
			.send({})
			.expect(400)
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});

	it("it should contain proper error response when sending only email", function (done) {
		const request = {
			email: "test",
		};
		const response = {
			message: "Bad request. Please send valid email and password",
			status: 400,
		};
		supertest(app)
			.post(URL)
			.send(request)
			.expect(response)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});

	it("it should contain proper error response when sending only password", function (done) {
		const request = {
			password: "test",
		};
		const response = {
			message: "Bad request. Please send valid email and password",
			status: 400,
		};
		supertest(app)
			.post(URL)
			.send(request)
			.expect(response)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});

	it("it should contain proper error response when sending invalid email", function (done) {
		const request = {
			email: "t",
			password: "test",
		};
		const response = {
			message: "Bad request. Please send valid email and password",
			status: 400,
		};
		supertest(app)
			.post(URL)
			.send(request)
			.expect(response)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});

	it("it should contain proper response with valid but wrong email, password combination", function (done) {
		const request = {
			email: "sanket@gmail.com",
			password: "this is demo password",
		};
		const response = {
			status: 401,
			message: "Wrong email password combination",
		};
		supertest(app)
			.post(URL)
			.send(request)
			.expect(response)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});

	it("it should contain proper response with valid and correct email, password combination", function (done) {
		const request = {
			email: "sanket@gmail.com",
			password: "sanket@123",
		};
		const response = {
			status: 200,
			message: "Success",
		};
		supertest(app)
			.post(URL)
			.send(request)
			.expect(response)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});
});
