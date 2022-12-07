const supertest = require("supertest");
const assert = require("assert");
const app = require("../app.js");

const URL = "/weather";

describe(`GET ${URL}/?city=somecity`, function () {
	it("it should return weather of city Delhi if no city query is specified", function (done) {
		supertest(app)
			.get(URL)
			.expect(200)
			.expect(function (res) {
				return res.location === "Delhi";
			})
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});

	it("it should return weather of city specified", function (done) {
		supertest(app)
			.get(`${URL}?city=Pune`)
			.expect(200)
			.expect(function (res) {
				return res.location === "Pune";
			})
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});

	it("it should return non-successfull code and response when invalid city name is provided", function (done) {
		let response = {
			status: 404,
			message: "city not found",
		};
		supertest(app)
			.get(`${URL}?city=Punep`)
			.expect(404)
			.expect(response)
			.end(function (err, res) {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});
});
