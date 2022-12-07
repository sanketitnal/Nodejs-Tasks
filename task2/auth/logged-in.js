var cache = require("../cache/cache");

function reqLogin(req, res, next) {
	const authToken = req.cookies["AuthToken"];
	if (!cache.isKeyPresent(authToken)) {
		res.status(401).json({
			status: 401,
			message: "Protected route, requires authentication",
		});
		return;
	}
	req.user = {
		token: authToken,
		email: cache.getV(authToken),
	};
	next();
}

module.exports = reqLogin;
