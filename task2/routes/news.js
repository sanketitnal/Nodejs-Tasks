var express = require("express");
var router = express.Router();
const NewsAPI = require("newsapi");

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const newsapi = new NewsAPI(NEWS_API_KEY);

/**
 * @swagger
 * components:
 *   schemas:
 *     standardresponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         message:
 *           type: string
 *     weathersummary:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         time:
 *           type: string
 *         main:
 *           type: string
 *         temp:
 *           type: number
 *     weatherschema:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *         unit:
 *           type: string
 *         location:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/weathersummary'
 *     newssummary:
 *       type: object
 *       properties:
 *         headline:
 *           type: string
 *         link:
 *           type: string
 *     newsschema:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/newssummary'
 *     signindet:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     signupdet:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /news?search=headline:
 *  get:
 *    summary: Get news headlines. PROTECTED ROUTE
 *    description: Get top news headlines and news links. User may provide optional search query. If no query is provided, simply top headlines will be returned.
 *    parameters:
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: Optional search text. If not provided, top headlines will be fetched.
 *        required: false
 *    responses:
 *      200:
 *        description: Successfully returned the requested data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/newsschema'
 *      401:
 *        description: If user isn't signed in
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

router.get("/", function (req, res, next) {
	let search = req.query.search;
	let options = {
		language: "en",
	};

	if (search) {
		options.q = search;
	}

	newsapi.v2
		.topHeadlines(options)
		.then((response) => {
			let transfData = transfNewsData(response);
			res.send(transfData);
		})
		.catch(function (error) {
			next(error);
		});
});

function transfNewsData(data) {
	let newData = {
		count: data.totalResults,
		data: [],
	};
	for (let a of data.articles) {
		newData.data.push({
			headline: a.title,
			link: a.url,
		});
	}
	return newData;
}

module.exports = router;
