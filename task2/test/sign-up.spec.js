const supertest = require("supertest");
const assert = require("assert");
const app = require("../app.js");

const URL = "/users/signup";

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
			status: 400,
			message: "Bad request. Please send valid email, password, name",
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
			status: 400,
			message: "Bad request. Please send valid email, password, name",
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
			name: "test",
		};
		const response = {
			status: 400,
			message: "Bad request. Please send valid email, password, name",
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

	it("it should contain proper response with valid email, password, name but user already exists", function (done) {
		const request = {
			email: "sanket@gmail.com",
			password: "this is demo password",
			name: "sanket",
		};
		const response = {
			status: 400,
			message: "User already exists",
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

	it("it should contain proper response with valid email, password, name and the user is new", function (done) {
		const request = {
			email: "stark@winterfell.com",
			password: "stark@123",
			name: "Eddard Stark",
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
