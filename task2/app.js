const dotenv = require("dotenv");
dotenv.config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUI = require("swagger-ui-express");
var swaggerJsDoc = require("swagger-jsdoc");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var weatherData = require("./routes/weather");
var newsData = require("./routes/news");
var reqLogin = require("./auth/logged-in");

global.__basedir = __dirname;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Swagger options
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "News and Weather API",
			version: "1.0.0",
			description: "A simple Express News and Weather API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/", indexRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/users", usersRouter);
app.use("/weather", weatherData);
app.use("/news", reqLogin, newsData);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: res.locals.message,
	});
	// res.render("error");
});

module.exports = app;
