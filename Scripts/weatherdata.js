/**
 * Function which will fetch all the data from the api.
 * By using promise, the data is fetched from the api.
 *
 * @return {Array} will return the data of all city.
 */
function getAllTheCityData() {
	let allTheCityData = new Promise((resolve, reject) => {
		var cityData = fetch("http://localhost:3117/all-timezone-cities", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((data) => {
				resolve(data.json());
			})
			.catch((Error) => {
				reject(Error);
			});
	});
	return allTheCityData;
}

/**
 * Async function to fetch the time and date from the api.
 * The time and date of the city is fetched by passing the input city from the selected input box.
 *
 * @param {string} fetchedCity
 * @return {Object} will return the time and date of the selected city.
 */
async function getTimeAndDate(fetchedCity) {
	try {
		var cityTimeAndDate = await fetch(
			`http://localhost:3117/city/?city=${fetchedCity}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (cityTimeAndDate.ok) return cityTimeAndDate.json();
		else {
			alert("Not a valid API, so sending default city as Vienna");
			var defaultCity = await fetch(`http://localhost:3117/city/?city=Vienna`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (defaultCity.ok) return defaultCity.json();
		}
	} catch (Error) {
		alert(Error.message);
	}
}

/**
 * Async function to fetch future temperature for next five hours.
 * The time and date which is fetch for a selected city is passed.
 *
 * @param {object} futureHour
 * @return {object} Will return the temperature for next five hours.
 */
async function getTheFutureTemperature(futureHour) {
	try {
		var fetchedHour = await fetch("http://localhost:3117/hourly-forecast", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(futureHour),
		});
		if (fetchedHour.ok) {
			return fetchedHour.json();
		} else {
			alert("Not a valid endpoint");
		}
	} catch (Error) {
		alert(Error.message);
	}
}

export { getAllTheCityData, getTimeAndDate, getTheFutureTemperature };
