/**
 * Temporarily using object,
 * Will use Redis in production
 */

cache = {
	"42c25ef1123346301d65edd48db9b15ea1700a2aae8eda5a934c64374c3c":
		"sanket@gmail.com",
};
// Initial value present only for testing purpose

cacheDB = {
	addKV: (key, value) => {
		cache[key] = value;
	},
	getV: (key) => {
		return cache[key];
	},
	removeK: (key) => {
		if (key in cache) {
			delete cache["key"];
		}
	},
	isKeyPresent: (key) => {
		return key in cache;
	},
};

module.exports = cacheDB;
