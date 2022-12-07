const cache = require("../cache/cache");

function cachedHttpResult(req, res, next) {
	console.log(req.cacheSearchKey);
	if (req.cacheSearchKey && cache.isKeyPresent(req.cacheSearchKey)) {
		console.log(`serving cached result ${req.cacheSearchKey}`);
		res.status(200).send(cache.getV(req.cacheSearchKey));
		return;
	} else {
		console.log("Not serving from cache");
		next();
	}
}

module.exports = cachedHttpResult;
