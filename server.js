var fs = require("fs");
var startTime = new Date();
var path = require("path");
var body = require("body-parser");
var dayCheck = 14400000;
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
const { fork } = require("child_process");
var allCityData = [];
// bodyparser will used to process data sent in an HTTP request body.
// the body of the url is parsed.
// Extended : false will return the parsed body as object.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
// Index.html is rendered if the url has only '/'
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});
let currentTime = new Date();
// If the url is all-time-cities, it will check for time in which the cities data should fetch again.
// If the current time - start time is grater than the 14400000 milliseconds, it again set the startTime.
// getAllTimeZone message is send to the child.
app.get("/all-timezone-cities", function (req, res) {
	const allTimeZoneChild = fork(`${__dirname}/Scripts/child.js`);
	var fetchAllCityData = { messageName: "getAllTimeZone", messagebody: {} };
	if (currentTime - startTime > dayCheck) {
		startTime = new Date();
		allTimeZoneChild.send(fetchAllCityData);
	} else {
		if (allCityData.length === 0) {
			allTimeZoneChild.send(fetchAllCityData);
		} else {
			res.json(allCityData);
		}
	}
	allTimeZoneChild.on("message", (allTheCityData) => {
		allCityData = allTheCityData;
		res.send(allTheCityData);
	});
});
// If the url is ?/city, it will pass the city name to the timeForOneCity function in timeZone.js
// It will fetch the city's date and time.
// The url is changed to '/city' because '/' is used to render the html file.
// getTimeForOneCity message and the selected city is send to the child.
app.get("/city", function (req, res) {
	const timeForOneCityChild = fork(`${__dirname}/Scripts/child.js`);
	var errorOccuredTime = new Date();
	try {
		if (!req.body) {
			throw new Error(
				`${errorOccuredTime} : req.body is not passed in req - /city`
			);
		} else if (!req.query.city) {
			throw new Error(
				`${errorOccuredTime} : Message body key is null in re - /city`
			);
		} else {
			let fetchTimeOfOneCity = {
				messageName: "getTimeForOneCity",
				messageBody: { city: req.query.city },
			};
			timeForOneCityChild.send(fetchTimeOfOneCity);
			timeForOneCityChild.on("message", (timeOfACity) => {
				res.send(timeOfACity);
			});
		}
	} catch (error) {
		// The error message will be logged in logger.txt file.
		fs.appendFile("Logger.txt", error.message, (err) => {});
	}
});
// If the url is /hourly-forcast, it will convert the body from stream to string. Once it is converted to string,
// it will call the nextNhoursWeather function in timeZone.js
// It will fetch the future temperature for the passed city.
// getFutureTemperature message, selected city's time and date, hours and all the city data are send to the child.
app.post("/hourly-forecast", function (req, res) {
	const nextNhoursWeatherChild = fork(`${__dirname}/Scripts/child.js`);
	var errorOccuredTime = new Date();
	try {
		if (!req.body) {
			throw new Error(
				`${errorOccuredTime} : req.body is not passed in req - /hourly-forcast`
			);
		} else if (
			!(req.body.city_Date_Time_Name && req.body.hours && allCityData)
		) {
			throw new Error(
				`${errorOccuredTime} : Message body key is null in req - /hourly-forecast`
			);
		} else {
			let fetchFutureTemperature = {
				messageName: "getFutureTemperature",
				messageBody: {
					timeAndDate: req.body.city_Date_Time_Name,
					hours: req.body.hours,
					cityData: allCityData,
				},
			};

			nextNhoursWeatherChild.send(fetchFutureTemperature);
			nextNhoursWeatherChild.on("message", (futureTemperature) => {
				res.send(futureTemperature);
			});
		}
	} catch (error) {
		res.status(404).json({ Error: error.message });
		// The error message will be logged in logger.txt file.
		fs.appendFile("Logger.txt", `\n${error.message}`, (err) => {});
	}
});

app.listen(3117);
