var express = require("express");
var router = express.Router();
const axios = require("axios");
const cachedHttpResult = require("../utils/cached-http-result");
const cache = require("../cache/cache");

const WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/forecast";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

/**
 * @swagger
 * /weather?city=cityname:
 *  get:
 *    summary: Get weather summary for next 5 days/3 hour
 *    description: Get weather summary for next 5 days/3 hour for the requested city. If no city is mentioned, defaults to city=Delhi
 *    parameters:
 *      - in: query
 *        name: city
 *        schema:
 *          type: string
 *        description: provide city name which is optional. If not provided, city=Delhi is chosen.
 *        required: false
 *    responses:
 *      200:
 *        description: Successfully returned the requested data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/weatherschema'
 *      404:
 *        description: When invalid city name is provided
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
router.get(
	"/",
	genWeatherCacheSearchKey,
	cachedHttpResult,
	function (req, res, next) {
		// Default city = Delhi
		let city = req.query.city || "Delhi";

		axios
			.get(WEATHER_API_URL, {
				method: "get",
				params: {
					q: city,
					appid: WEATHER_API_KEY,
					units: "metric",
				},
			})
			.then(function (response) {
				let resData = transWeathData(response.data);
				res.send(resData);
				cache.addKV(`weather_${city ? city : "Delhi"}`, resData);
			})
			.catch(function (error) {
				// console.log(error);
				if (error.response) {
					res.status(error.response.status || 500).json({
						status: error.response.status || 500,
						message: error.response.data && error.response.data.message,
					});
					return;
				}
				next(error);
			});
	}
);

//  transform weather data
function transWeathData(data) {
	let newData = {
		count: data.cnt,
		unit: "metric",
		location: data.city && data.city.name,
		data: [],
	};
	for (let wd of data.list) {
		let dt = new Date(wd.dt_txt);
		newData.data.push({
			date: dt.toDateString(),
			time: `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`,
			main: wd.weather[0].main,
			temp: wd.main.temp,
		});
	}
	return newData;
}

function genWeatherCacheSearchKey(req, res, next) {
	let city = req.query.city;
	let cacheSearchKey = `weather_${city ? city : "Delhi"}`;
	req.cacheSearchKey = cacheSearchKey;
	next();
}

module.exports = router;
