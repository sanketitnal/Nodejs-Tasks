const supertest = require("supertest");
const assert = require("assert");
const app = require("../app.js");

const URL = "/news";

describe(`GET ${URL}?search=some-trending-topic`, function () {
	it(`it should have status code 401 "Unauthorized" when user is not logged in`, function (done) {
		supertest(app)
			.get(URL)
			.expect(401)
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});

	it(`it should return proper response and message when user is not logged in to describe that this is a protected route`, function (done) {
		let response = {
			message: "Protected route, requires authentication",
			status: 401,
		};
		supertest(app)
			.get(URL)
			.expect(401)
			.expect(response)
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});

	it(`it should return news when user is logged in`, function (done) {
		supertest(app)
			.get(URL)
			.set(
				"Cookie",
				"AuthToken=42c25ef1123346301d65edd48db9b15ea1700a2aae8eda5a934c64374c3c"
			)
			.expect(200)
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});
});
