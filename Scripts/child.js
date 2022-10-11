// timeZone.js is published as package. It is imported as timezone.
const timezone = require("weatherdata_timezone");
// If the received message is getAllTimeZone, allTimeZones function is called.
// If the received message is getTimeForOneCity, timeForOneCity function is called.
// If the received message is getFututreTemperture, nextNhoursWeather function is called.
process.on("message", (message) => {
	messageContent = message.messageName;
	switch (messageContent) {
		case "getAllTimeZone":
			var allTheCityData = timezone.allTimeZones();
			process.send(allTheCityData);
			break;
		case "getTimeForOneCity":
			var timeOfACity = timezone.timeForOneCity(message.messageBody.city);
			process.send(timeOfACity);
			break;
		case "getFutureTemperature":
			var futureTemperature = timezone.nextNhoursWeather(
				message.messageBody.timeAndDate,
				message.messageBody.hours,
				message.messageBody.cityData
			);
			process.send(futureTemperature);
			break;
	}
	process.exit();
});
