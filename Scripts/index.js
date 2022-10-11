import {
	importCityDataToDatalist,
	updateUI,
	scrollOverFlowContent,
	setBorder,
	selectIcon,
	arrayToObj,
} from "./utility.js";
import {
	getAllTheCityData,
	getTimeAndDate,
	getTheFutureTemperature,
} from "./weatherdata.js";
var iconSrc;
var data;
document.getElementById("main-body").style.display = "none";
document.body.style.backgroundImage = 'url("./Assets/weatherPage.gif")';
document.body.style.backgroundPosition = "center top";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "50%";
export async function updateWeatherData() {
	var inputElement;
	var isValid = 0;
	let interval;
	importCityDataToDatalist();
	/**
	 * Contructor called SelectedInputCity contains set and get functions which set and get the data.
	 *
	 */
	class SelectedInputCity {
		constructor() {
			this.setTemperature = function (temperature) {
				this.temperature = temperature;
			};
			this.setCityName = function (cityName) {
				this.cityName = cityName;
			};
			this.setDateAndTime = function (dateAndTime) {
				this.dateAndTime = dateAndTime;
			};
			this.setTimeZone = function (timeZone) {
				this.timeZone = timeZone;
			};
			this.setHumidity = function (humidity) {
				this.humidity = humidity;
			};
			this.setPrecipitation = function (precipitation) {
				this.precipitation = precipitation;
			};
			this.setNextFiveHrs = function (nextFiveHrs) {
				this.nextFiveHrs = nextFiveHrs;
			};
			this.getCityName = function () {
				return this.cityName;
			};
			this.getDateAndTime = function () {
				return this.dateAndTime;
			};
			this.getTimeZone = function () {
				return this.timeZone;
			};
			this.getTemperature = function () {
				return this.temperature;
			};
			this.getHumidity = function () {
				return this.humidity;
			};
			this.getPrecipitation = function () {
				return this.precipitation;
			};
			this.getNextFiveHrs = function () {
				return this.nextFiveHrs;
			};
		}
		/**
		 * The function to update data to the selected city, if it match with the city in data.js file.
		 *
		 */
		async updateDataOnSelectedCity() {
			inputElement = document.getElementById("selected-city");
			var selectedCity = inputElement.value;
			// The selected city is compared with the city names in json file
			for (var optedCity in data) {
				if (
					selectedCity.toLowerCase() == data[optedCity].cityName.toLowerCase()
				) {
					isValid = 1;
					break;
				} else {
					isValid = 0;
				}
			}
			if (isValid == 1) {
				var timeAndDateOfTheCity = await getTimeAndDate(selectedCity);
				timeAndDateOfTheCity.hours = 6;
				var fetchFutureWeatherData = await getTheFutureTemperature(
					timeAndDateOfTheCity
				);
				data[selectedCity.toLowerCase()].nextFiveHrs =
					fetchFutureWeatherData.temperature;
				fetchedCityData.updateCityIcon(selectedCity);
				fetchedCityData.updateDateTime(selectedCity);
				fetchedCityData.upadateTemperatureOfTheSelectedCity(selectedCity);
				fetchedCityData.upadteHumidity(selectedCity);
				fetchedCityData.updatePrecipitation(selectedCity);
				fetchedCityData.updateIconForNextFiveHours(selectedCity);
				fetchedCityData.updateIconForCurrentTemperature(selectedCity);
			}
			// If the city which is entered is not matched, the invalidCase function is invoked.
			else {
				fetchedCityData.invalidCase();
			}
		}
		/**
		 * Function to update the city icon based on the selected city name.
		 *
		 * @param {string} inputCity Selected city name is passed as a parameter.
		 */
		updateCityIcon(inputCity) {
			updateUI("icon-img", "src", `./assets/${inputCity.toLowerCase()}.svg`);
		}
		/**
		 * Function to update current date and time for the selected city name by passing the selected city.
		 *
		 *
		 * @param {string} selectedCity Selected city name is passed as a parameter.
		 */
		updateDateTime(selectedCity) {
			function displayTime() {
				var time = new Date().toLocaleString("en-US", {
					timeZone: data[selectedCity.toLowerCase()].timeZone,
				});
				var day = new Date(time).getDate();
				day = day < 10 ? `0${day}` : day;
				var month = new Date(time).toLocaleString("en-US", { month: "short" });
				var year = new Date(time).getFullYear();
				updateUI("date", "innerHTML", `${day}-${month}-${year}`);

				var hour = new Date(time).getHours();
				var minute = new Date(time).getMinutes();
				var second = new Date(time).getSeconds();
				var timeAmPm;
				// Hour, minute, second and AM/PM are passed to a function so that the hour, minute, second will append 0 infront if it is <10. AM/PM will also updated.
				var updateExactTime = fetchedCityData.updateHourMinuteSecond(
					hour,
					minute,
					second,
					timeAmPm
				);
				updateUI(
					"time",
					"innerHTML",
					`${updateExactTime.hour}:${updateExactTime.minute}:`
				);
				updateUI("seconds-hand", "innerHTML", `${updateExactTime.second}`);
				//Function will invoke another function which will update the time for next five hours.
				fetchedCityData.updateFutureTime(
					updateExactTime.hour,
					updateExactTime.timeAmPm,
					updateExactTime.alterAmPm
				);
				// Function contain another function which will update the Am or Pm image.
				var partOfTheDay = "PM";
				if (updateExactTime.timeAmPm == partOfTheDay) {
					updateUI("ampm-img", "src", `./assets/pmState.svg`);
				} else {
					updateUI("ampm-img", "src", `./assets/amState.svg`);
				}
			}
			displayTime();
			clearInterval(interval);
			interval = setInterval(displayTime, 1000);
		}
		updateHourMinuteSecond(hour, minute, second, timeAmPm) {
			timeAmPm = hour >= 12 ? "PM" : "AM";

			// hour=hour==0?12:hour;
			if (hour == 0) {
				hour = 12;
				timeAmPm = "AM";
			}
			var alterAmPm = timeAmPm == "PM" ? "AM" : "PM";
			hour = hour > 12 ? hour - 12 : hour;
			hour = hour < 10 ? `0${hour}` : hour;
			minute = minute < 10 ? `0${minute}` : minute;
			second = second < 10 ? `0${second}` : second;
			return {
				hour: hour,
				minute: minute,
				second: second,
				timeAmPm: timeAmPm,
				alterAmPm: alterAmPm,
			};
		}
		/**
		 * Function to update to time for next five hours by passing the current hour and Am or Pm.
		 *
		 * @param {number} inputHour Current hour is passed as parameter.
		 * @param {string} inputAmPm Am or Pm is passed as parameter.
		 */
		updateFutureTime(inputHour, inputAmPm, alterAmPm) {
			for (var i = 0; i < 5; i++) {
				inputHour++;
				if (inputHour > 12) {
					inputHour -= 12;
				}
				if (inputHour > 11) {
					inputAmPm = alterAmPm;
				}
				updateUI(
					`forcast-time${i + 1}`,
					"innerHTML",
					`${parseInt(inputHour)}${inputAmPm}`
				);
			}
		}
		/**
		 * Function will update the temperature for the current selected city without passing any parameter.
		 * function will also update the fahrenheit for the selected city.
		 */
		upadateTemperatureOfTheSelectedCity(inputCity) {
			fetchedCityData.setTemperature(data[inputCity.toLowerCase()].temperature);
			var currentTemperature = fetchedCityData.getTemperature().split("°");
			updateUI(
				"temp-no",
				"innerHTML",
				`<strong>${currentTemperature[0]} ${currentTemperature[1]}</strong>`
			);
			// The fetched temperature is multiplied with 1.8 and added with 32 to get the faherenheit.
			(function () {
				var fahrenheit = (currentTemperature[0] * 1.8 + 32).toFixed();
				updateUI("fahrenheit", "innerHTML", `<strong>${fahrenheit} F</strong>`);
			})();
		}
		/**
		 * Function will update the humidity for the selected city without passing any paramter.
		 * the humidity is fetched from the JSON file  and displayed in the UI.
		 */
		upadteHumidity(inputCity) {
			fetchedCityData.setHumidity(data[inputCity.toLowerCase()].humidity);
			var fetchedHumidity = fetchedCityData.getHumidity();
			updateUI(
				"humidity",
				"innerHTML",
				`<strong>${parseInt(fetchedHumidity)}</strong>`
			);
			var humidityPercentage = "%";
			console.log(document.getElementById("humidity-percentage"));
			updateUI("humidity-percentage", "innerHTML", humidityPercentage);
		}
		/**
		 * Function will update precipitation for the selected city without passing any parameter.
		 * The precipitation is fetched from the JSON file  and displayed in the UI.
		 *
		 */
		updatePrecipitation(inputCity) {
			fetchedCityData.setPrecipitation(
				data[inputCity.toLowerCase()].precipitation
			);
			var fetchedPrecipitation = fetchedCityData.getPrecipitation();
			updateUI(
				"precipitation",
				"innerHTML",
				`<strong>${parseInt(fetchedPrecipitation)}</strong>`
			);
			var precipitationPercentage = "%";
			updateUI("precipitation-percentage","innerHTML",precipitationPercentage);
		}
		// Function to display icon for temperture. The function will check the temperature and set the suitable icon.
		displayIconForTemperature(fiveHours, i) {
			if (
				fetchedCityData.checkIfTemperatureIsWithinTheRange(
					parseInt(fiveHours),
					Number.MIN_SAFE_INTEGER,
					18
				)
			) {
				updateUI(`temp-icon${i}`, "src", "./Assets/rainyIcon.svg");
			}

			// If the temperature is between 18 and 22 degree then the icon will be windy.
			else if (
				fetchedCityData.checkIfTemperatureIsWithinTheRange(
					parseInt(fiveHours),
					18,
					23
				)
			) {
				updateUI(`temp-icon${i}`, "src", "./Assets/windyIcon.svg");
			}

			// If the temperature is between 23 and 29 degree then the icon will be cloudy.
			else if (
				fetchedCityData.checkIfTemperatureIsWithinTheRange(
					parseInt(fiveHours),
					23,
					29
				)
			) {
				updateUI(`temp-icon${i}`, "src", "./Assets/cloudyIcon.svg");
			}

			// If the temperature is greater than 29 degree then the icon will be sunny.
			else {
				updateUI(`temp-icon${i}`, "src", "./Assets/sunnyIconBlack.svg");
			}
		}
		/**
		 * Function will update the temperature icon according to the temperture for next five hours.
		 *
		 */
		updateIconForNextFiveHours(inputCity) {
			fetchedCityData.setNextFiveHrs(data[inputCity.toLowerCase()].nextFiveHrs);
			var fiveHours = fetchedCityData.getNextFiveHrs();
			for (var i = 1; i < 6; i++) {
				fetchedCityData.displayIconForTemperature(
					parseInt(fiveHours[i - 1]),
					i
				);
				updateUI(
					`forcast-temp${i}`,
					"innerHTML",
					`${parseInt(fiveHours[i - 1])}`
				);
			}
			var currentTime = "Now";
			updateUI("forcast-time0", "innerHTML", currentTime);
		}
		/**
		 * Function will update temperature for the current temperature of the selected city.
		 *
		 */
		updateIconForCurrentTemperature(inputCity) {
			fetchedCityData.setTemperature(data[inputCity.toLowerCase()].temperature);
			var fetchedTemperature = fetchedCityData.getTemperature();
			var temperatureInt = parseInt(fetchedTemperature);
			var i = 0;
			fetchedCityData.displayIconForTemperature(temperatureInt, i);
			updateUI(`forcast-temp0`, "innerHTML", `${temperatureInt}`);
		}
		/**
		 * Function will compare the temperature with the maximum and minimum temperature.
		 *
		 * @param {number} temperatureInt The temperature fetched from the data is passed.
		 * @param {number} min Minimum temperature is passed
		 * @param {number} max Maximum temperature is passed
		 * @return {boolean} If the condition satisfied, true is returned
		 */
		checkIfTemperatureIsWithinTheRange(temperatureInt, min, max) {
			if (temperatureInt < max && temperatureInt >= min) return true;
		}
		/**
		 * Funtion to update nil if the input city doesn't match the city in the data file.
		 *
		 *
		 */
		invalidCase() {
			clearInterval(interval);
			updateUI("icon-img", "src", `./assets/warning.svg`);
			updateUI("temp-no", "innerHTML", `<strong>Nil</strong>`);
			updateUI("fahrenheit", "innerHTML", `<strong>Nil</strong>`);
			updateUI("humidity", "innerHTML", `<strong>Nil</strong>`);
			updateUI("precipitation", "innerHTML", `<strong>Nil</strong>`);
			alert("Warning!!! Invalid city name");
			for (let i = 0; i <= 5; i++) {
				updateUI(`temp-icon${i}`, "src", `./assets/warning.svg`);
				updateUI(`forcast-temp${i}`, "innerHTML", `Nil`);
				updateUI(`forcast-time${i}`, "innerHTML", `Nil`);
			}
			updateUI("time", "innerHTML", `Nil`);
			updateUI("seconds-hand", "innerHTML", ` `);
			updateUI("ampm-img", "src", `./assets/warning.svg`);
			updateUI("date", "innerHTML", `Nil`);
		}
	}
	// updateUI function is imported and assigned as a prototype for top section constructor.

	let fetchedCityData = new SelectedInputCity();
	fetchedCityData.updateDataOnSelectedCity();
	document
		.getElementById("selected-city")
		.addEventListener("change", fetchedCityData.updateDataOnSelectedCity);

	// Initializing an array of cities called sunnyCities which temperature is greater than 29,
	// humidity lesser than 50 and precipitation greater than or equal to 50.
	// Initializing an array of cities called coldCities which temperature is greater than or equal to 20 and lesser than or equal to 28,
	// humidity greater than 50 and precipitation lesser than 50.
	// Initializing an array of cities called rainyCities which temperature is lesser than 20,
	// humidity greater than or equal to 50.
	class FileredCard extends SelectedInputCity {
		constructor() {
			super();
			this.sunnyCities = Object.values(data).filter(
				(value) =>
					parseInt(value.temperature) > 29 &&
					parseInt(value.humidity) < 50 &&
					parseInt(value.precipitation) >= 50
			);
			this.coldCities = Object.values(data).filter(
				(value) =>
					parseInt(value.temperature) >= 20 &&
					parseInt(value.temperature) <= 28 &&
					parseInt(value.humidity) > 50 &&
					parseInt(value.precipitation) < 50
			);
			this.rainyCities = Object.values(data).filter(
				(value) =>
					parseInt(value.temperature) < 20 && parseInt(value.humidity) >= 50
			);
		}
		/**
		 * Function to display the selected city cards according to the input in the spinner.
		 * The value in the spinner is compared with the number of cities in the array, the highest is displayed.
		 */
		displayTheNumberOfCardsSelected() {
			var cardNumber = document.getElementById("num").value;
			var selectedImg = selectIcon.call(weatherSource);
			cardNumber =
				selectedImg.length < cardNumber ? selectedImg.length : cardNumber;
			var cardContainer = document.getElementById("box-container");
			cardContainer.replaceChildren();
			// All the cities in the array is displayed in cards by loop.
			if (cardNumber > 0) {
				for (let i = 0; i < cardNumber; i++) {
					fetchedCardData.createCardForCities(selectedImg, i, iconSrc);
				}
			}
		}
		/**
		 * Function to sort the sunny, cold and rainy city arrays.
		 *
		 * @param {string} weatherCriteria criteria by the the array should be sorted.
		 * @param {Array} cityArrayName Array of the selected city.
		 */
		sortTheCityBasedOnTheCityName(cityArrayName, weatherCriteria) {
			cityArrayName.sort(function (a, b) {
				return parseInt(b[weatherCriteria]) - parseInt(a[weatherCriteria]);
			});
		}
		/**
		 * Function will set a border bottom line with blue color for sunny icons when it is clicked.
		 *
		 */
		displaySunnyCities() {
			iconSrc = "sunnyIcon";
			setBorder(iconSrc);
			document.getElementById("num").value = 3;
			// function to display sunny city cards is called.
			fetchedCardData.displayTheNumberOfCardsSelected();
		}
		/**
		 * Function will set a border bottom line with blue color for snow icon when it is clicked.
		 *
		 */
		displayColdCities() {
			iconSrc = "snowflakeIcon";
			setBorder(iconSrc);
			document.getElementById("num").value = 3;
			// function to display cold city cards is called.
			fetchedCardData.displayTheNumberOfCardsSelected();
		}
		/**
		 * Function will set a border bottom line with blue color for rainy icon when it is clicked.
		 *
		 */
		displayRainyCities() {
			iconSrc = "rainyIcon";
			setBorder(iconSrc);
			document.getElementById("num").value = 3;
			// function to display rainy city cards is called.
			fetchedCardData.displayTheNumberOfCardsSelected();
		}
		/**
		 * Function to create the name and temperature div and set its attribute and append it to the card div which is passed as a parameter.
		 *
		 * @param {object} cardOfTheSelectedCity The card div in which the name and temperature div are appended.
		 * @param {Array} selectedArray Array name of the selected icon.
		 * @param {number} i index of the city in the object.
		 * @param {string} weatherIcon icon img of the selected icon.
		 */
		createCardNameAndTemperature(
			cardOfTheSelectedCity,
			selectedArray,
			i,
			weatherIcon
		) {
			var cityNameAndTemp = document.createElement("div");
			var nameOfTheCity = document.createElement("div");
			var iconAndTemp = document.createElement("div");
			var iconOfTheTemp = document.createElement("img");
			cityNameAndTemp.setAttribute("class", "city-temp");
			iconAndTemp.setAttribute("class", "sun-temp");
			iconOfTheTemp.setAttribute("src", `./Assets/${iconSrc}.svg`);
			iconOfTheTemp.setAttribute("alt", iconSrc);
			iconOfTheTemp.setAttribute("class", "card-temp-icon");
			cardOfTheSelectedCity.appendChild(cityNameAndTemp);
			cityNameAndTemp.appendChild(nameOfTheCity);
			nameOfTheCity.append(selectedArray[i].cityName);
			cityNameAndTemp.append(iconAndTemp);
			iconAndTemp.appendChild(iconOfTheTemp);
			iconAndTemp.append(selectedArray[i].temperature);
		}
		/**
		 * Function to create time and date div and set it attribute and append it to the card div.
		 * live time and date is set in the card.
		 *
		 * @param {object} cardOfTheSelectedCity The card div in which the time and date div are appended.
		 * @param {Array} selectedArray Array name of the selected icon.
		 * @param {number} i index of the city in the object.
		 */
		createCardTimeAndDate(cardOfTheSelectedCity, selectedArray, i) {
			var cardTimeDate = document.createElement("div");
			var currentCardTime = document.createElement("p");
			var currentCardDate = document.createElement("p");
			cardTimeDate.setAttribute("class", "box-time-date");
			// setInterval for displaying live time
			clearInterval(liveTimeUpdate);
			fetchedCardData.setLiveTimeOnCard(
				selectedArray,
				i,
				currentCardTime,
				currentCardDate
			);
			var liveTimeUpdate = setInterval(
				fetchedCardData.setLiveTimeOnCard,
				1,
				selectedArray,
				i,
				currentCardTime,
				currentCardDate
			);
			cardOfTheSelectedCity.appendChild(cardTimeDate);
			cardTimeDate.appendChild(currentCardTime);
			cardTimeDate.appendChild(currentCardDate);
		}
		/**
		 *Function to create humidity and precipitation div and set its attribute and append it to card div.
		 *
		 * @param {object} cardOfTheSelectedCity The card div in which the humidity and precipitation div are appended.
		 * @param {Array} selectedArray Array name of the selected icon.
		 * @param {number} i index of the city in the object.
		 */
		createCardHumidityAndPrecipitation(
			cardOfTheSelectedCity,
			selectedArray,
			i
		) {
			var cardHumidityPrecipitation = document.createElement("div");
			var humidityAndIcon = document.createElement("div");
			var iconOfHumidity = document.createElement("img");
			cardHumidityPrecipitation.setAttribute("class", "humidity-precipitation");
			humidityAndIcon.setAttribute("class", "box-icon");
			iconOfHumidity.setAttribute("class", "humidity-precipitation-icon");
			iconOfHumidity.setAttribute("src", "./Assets/humidityIcon.svg");
			iconOfHumidity.setAttribute("alt", "humidityIcon");
			cardOfTheSelectedCity.appendChild(cardHumidityPrecipitation);
			cardHumidityPrecipitation.appendChild(humidityAndIcon);
			humidityAndIcon.appendChild(iconOfHumidity);
			humidityAndIcon.append(selectedArray[i].humidity);
			// Function create precipitation card and set its attribute and append to the cardHumidityPrecipitation div
			(function () {
				var precipitationAndIcon = document.createElement("div");
				var iconOfPrecipitation = document.createElement("img");
				precipitationAndIcon.setAttribute("class", "box-icon");
				iconOfPrecipitation.setAttribute(
					"class",
					"humidity-precipitation-icon"
				);
				iconOfPrecipitation.setAttribute(
					"src",
					"./Assets/precipitationIcon.svg"
				);
				iconOfPrecipitation.setAttribute("alt", "precipitationIcon");
				cardHumidityPrecipitation.appendChild(precipitationAndIcon);
				precipitationAndIcon.appendChild(iconOfPrecipitation);
				precipitationAndIcon.append(selectedArray[i].precipitation);
			})();
		}
		/**
		 * Function to create the element of the cards and set the class for the the elements.
		 *
		 * @param {Array} selectedArray Array name of the selected icon.
		 * @param {number} i index of the city in the object.
		 * @param {string} weatherIcon icon img of the selected icon.
		 */
		createCardForCities(selectedArray, i, weatherIcon) {
			var cardContainer = document.getElementById("box-container");
			var cardOfTheSelectedCity = document.createElement("div");
			cardOfTheSelectedCity.setAttribute("class", "box");
			cardOfTheSelectedCity.style.background =
				"rgb(35 34 34) url(../Assets/" +
				selectedArray[i].cityName.toLowerCase() +
				".svg) no-repeat bottom right";
			cardOfTheSelectedCity.style.backgroundSize = "8em";
			cardContainer.appendChild(cardOfTheSelectedCity);
			fetchedCardData.createCardNameAndTemperature(
				cardOfTheSelectedCity,
				selectedArray,
				i,
				weatherIcon
			);
			fetchedCardData.createCardTimeAndDate(
				cardOfTheSelectedCity,
				selectedArray,
				i
			);
			fetchedCardData.createCardHumidityAndPrecipitation(
				cardOfTheSelectedCity,
				selectedArray,
				i
			);
			cardContainer.replaceChildren;
		}
		sortCityArray() {
			fetchedCardData.sortTheCityBasedOnTheCityName(
				fetchedCardData.sunnyCities,
				"temperature"
			);
			fetchedCardData.sortTheCityBasedOnTheCityName(
				fetchedCardData.coldCities,
				"precipitation"
			);
			fetchedCardData.sortTheCityBasedOnTheCityName(
				fetchedCardData.rainyCities,
				"humidity"
			);
		}
		/**
		 * Function to set live time and date in the card.
		 *
		 * @param {Array} selectedArray array name of the selected icon.
		 * @param {number} i index of the city in the object.
		 * @param {object} currentCardTime cardTime div element is passed to display the live time
		 * @param {object} currentCardDate cardDate div element is passed to display the live date
		 */
		setLiveTimeOnCard(selectedArray, i, currentCardTime, currentCardDate) {
			var time = new Date().toLocaleString("en-US", {
				timeZone: selectedArray[i].timeZone,
			});
			var hour = new Date(time).getHours();
			var minute = new Date(time).getMinutes();
			var timeAmPm;
			var updateExactTime = fetchedCardData.updateHourMinuteSecond(
				hour,
				minute,
				timeAmPm
			);
			currentCardTime.innerHTML = `${updateExactTime.hour}:${updateExactTime.minute} ${updateExactTime.timeAmPm}`;
			var day = new Date(time).getDate();
			day = day < 10 ? `0${day}` : day;
			var month = new Date(time).toLocaleString("en-US", { month: "short" });
			var year = new Date(time).getFullYear();
			currentCardDate.innerHTML = `${day}-${month}-${year}`;
		}
		/**
		 * Function to display the backward and forward arrow button when the box container width overflows.
		 *
		 */
		displayScroll() {
			var carousel = document.getElementsByClassName("back-front-img");
			var cards = document.getElementById("box-container");
			for (let i = 0; i < carousel.length; i++) {
				if (cards.scrollWidth > cards.clientWidth) {
					carousel[i].style.display = "block";
				} else {
					carousel[i].style.display = "none";
				}
			}
		}
	}
	var fetchedCardData = new FileredCard();
	document
		.getElementById("num")
		.addEventListener(
			"change",
			fetchedCardData.displayTheNumberOfCardsSelected
		);
	fetchedCardData.sortCityArray();

	iconSrc = "sunnyIcon";

	// When sunny icon is clicked, displaySunnyCities function is called.
	document
		.getElementById("sunny-icon")
		.addEventListener("click", fetchedCardData.displaySunnyCities);
	// When snow icon is clicked, displayColdCities function is called.
	document
		.getElementById("snow-icon")
		.addEventListener("click", fetchedCardData.displayColdCities);
	// When rainy icon is clicked, displayRainyCities function is called.
	document
		.getElementById("rainy-icon")
		.addEventListener("click", fetchedCardData.displayRainyCities);
	var weatherSource = {
		sunnyIcon: fetchedCardData.sunnyCities,
		snowflakeIcon: fetchedCardData.coldCities,
		rainyIcon: fetchedCardData.rainyCities,
	};

	// displayTheNumberOfCardsSelected function is called when the spinner is changed.
	setInterval(fetchedCardData.displayScroll, 100);
	// displaySunnyCities and scrollOverFlowContent functions are called once the page is loaded.
	fetchedCardData.displaySunnyCities();
	scrollOverFlowContent();
	// Initialize an array where the datas are fetched from json file.
	// Initialize a variable called continentArrowElement in which the continent arrow's id is got.
	// Initialize a variable called temperaturetArrow in which the temperature arrow's id is got.
	class SortedTile extends SelectedInputCity {
		constructor() {
			super();
			this.cardData = Object.entries(data).map(function (value) {
				return value[1];
			});
			this.continentArrowElement = document.getElementById("continent-arrow");
			this.temperatureArrowElement =
				document.getElementById("temperature-arrow");
		}
		/**
		 * Function to display the continent cards.
		 * createCardForContinent function is called in a loop and the index number is passed.
		 *
		 */
		displayContinentTile() {
			var cardContainer = document.getElementById("card-container");
			cardContainer.replaceChildren();
			for (var i = 0; i < 12; i++) {
				fetchedTileData.createCardForContinent(i);
			}
		}
		/**
		 * Function to sort the cardDate based on temperature arrow and continent arrow.
		 * cardData is sorted based on temperature only if the continent name matches.
		 * If arrow temperature is down, sort the array in ascending order, or else sort in descending order.
		 * If the continent arrow is down, sort the array in ascending order, or else sort in descending order.
		 */
		sortContinentTile() {
			fetchedTileData.cardData.sort(function (a, b) {
				if (a.timeZone.split("/")[0] == b.timeZone.split("/")[0]) {
					return fetchedTileData.temperatureArrowElement.name ==
						"temperature-arrow-down"
						? parseInt(a.temperature) - parseInt(b.temperature)
						: parseInt(b.temperature) - parseInt(a.temperature);
				} else {
					return fetchedTileData.continentArrowElement.name ==
						"continent-arrow-up"
						? a.timeZone.split("/")[0] < b.timeZone.split("/")[0]
							? 1
							: -1
						: a.timeZone.split("/")[0] < b.timeZone.split("/")[0]
						? -1
						: 1;
				}
			});
			fetchedTileData.displayContinentTile();
		}
		/**
		 * Function will update the sorted cards based on the temperature when the arrow is clicked.
		 * Once the arrow down is clicked, the arrow down image will change to arrow up and vise versa.
		 * when the image is arrow down then the cards are sorted in ascending order, when the image is arrow up then the cards are sorted in descending order.
		 *
		 */
		updateTemperatureOnClick() {
			if (
				fetchedTileData.temperatureArrowElement.name == "temperature-arrow-up"
			) {
				fetchedTileData.temperatureArrowElement.name = "temperature-arrow-down";
				fetchedTileData.temperatureArrowElement.src = "./Assets/arrowDown.svg";
			} else {
				fetchedTileData.temperatureArrowElement.name = "temperature-arrow-up";
				fetchedTileData.temperatureArrowElement.src = "./Assets/arrowUp.svg";
			}
			fetchedTileData.sortContinentTile();
		}
		/**
		 * Function will update the sorted cards based on the continent name when the arrow is clicked.
		 * Once the arrow down is clicked, the arrow down image will change to arrow up and vise versa.
		 * when the image is arrow down then the cards are sorted in ascending order, when the image is arrow up then the cards are sorted in descending order.
		 *
		 */
		updateContinentOnClick() {
			if (
				fetchedTileData.continentArrowElement.name == "continent-arrow-down"
			) {
				fetchedTileData.continentArrowElement.name = "continent-arrow-up";
				fetchedTileData.continentArrowElement.src = "./Assets/arrowUp.svg";
			} else {
				fetchedTileData.continentArrowElement.name = "continent-arrow-down";
				fetchedTileData.continentArrowElement.src = "./Assets/arrowDown.svg";
			}
			fetchedTileData.sortContinentTile();
		}
		/**
		 * Function to create a div for name of the continent and set its attribute and append it to the continent card div.
		 *
		 * @param {Object} cardOfTheContinent the card div in which the name div is appended.
		 * @param {number} i index of the selectedd city.
		 */
		createCardElementForContinentName(cardOfTheContinent, i) {
			var nameOfTheContinent = document.createElement("div");
			nameOfTheContinent.setAttribute("class", "conti-name");
			cardOfTheContinent.appendChild(nameOfTheContinent);
			nameOfTheContinent.append(
				fetchedTileData.cardData[i].timeZone.split("/")[0]
			);
		}
		/**
		 * Function to create a div for temperature and set its attribute and append it to the continent card div.
		 *
		 * @param {object} cardOfTheContinent The card div in which the temperature is appended.
		 * @param {number} i index of the selected city.
		 */
		createCardElementForTemperature(cardOfTheContinent, i) {
			var temperatureOfTheSelectedCity = document.createElement("div");
			var boldTemperature = document.createElement("strong");
			temperatureOfTheSelectedCity.setAttribute("class", "card-temp");
			cardOfTheContinent.appendChild(temperatureOfTheSelectedCity);
			temperatureOfTheSelectedCity.appendChild(boldTemperature);
			boldTemperature.append(fetchedTileData.cardData[i].temperature);
		}
		/**
		 * Function to create a div for city name and time and set its attribute and append it to the continent card div.
		 *
		 * @param {object} cardOfTheContinent The card div in which the city name and time is appended.
		 * @param {number} i Index of the selected city.
		 */
		createCardElementForCityAndTime(cardOfTheContinent, i) {
			var cityAndTime = document.createElement("div");
			cityAndTime.setAttribute("class", "place-time");
			cardOfTheContinent.appendChild(cityAndTime);
			clearInterval(intervalClear);
			var intervalClear = setInterval(
				fetchedTileData.setLiveTimeOnContinentCard,
				1,
				fetchedTileData.cardData,
				i,
				cityAndTime
			);
		}
		/**
		 * Function to create a div for humidity and set its attrbute anf append it to the continent card div.
		 *
		 * @param {object} cardOfTheContinent THe card div in which the humidity is appended.
		 * @param {number} i Index of the selected city.
		 */
		createCardElementForHumidity(cardOfTheContinent, i) {
			var humidityAndIcon = document.createElement("div");
			var humidityIcon = document.createElement("img");
			humidityAndIcon.setAttribute("class", "card-humidity");
			humidityIcon.setAttribute("class", "humid-icon");
			humidityIcon.setAttribute("src", "./Assets/humidityIcon.svg");
			humidityIcon.setAttribute("alt", "humidity");
			cardOfTheContinent.appendChild(humidityAndIcon);
			humidityAndIcon.appendChild(humidityIcon);
			humidityAndIcon.append(fetchedTileData.cardData[i].humidity);
		}
		/**
		 * Function will create a card to display the continent name, temperature, city name, time and humidity.
		 * The elemnts are created and set the attributes and append the elements with the other and append the conents to be displayed.
		 * @param {number} i index of the array to get the city
		 */
		createCardForContinent(i) {
			var cardContainer = document.getElementById("card-container");
			var cardOfTheContinent = document.createElement("div");
			cardOfTheContinent.setAttribute("class", "card");
			cardContainer.appendChild(cardOfTheContinent);
			fetchedTileData.createCardElementForContinentName(cardOfTheContinent, i);
			fetchedTileData.createCardElementForTemperature(cardOfTheContinent, i);
			fetchedTileData.createCardElementForCityAndTime(cardOfTheContinent, i);
			fetchedTileData.createCardElementForHumidity(cardOfTheContinent, i);
		}
		/**
		 * Function to set live time of the selected city and append it to the city name card.
		 *
		 * @param {*} cardData Array of citites.
		 * @param {*} i Index of the slected city.
		 * @param {*} cityAndTime The card div in which the live time is appended.
		 */
		setLiveTimeOnContinentCard(cardData, i, cityAndTime) {
			var time = new Date().toLocaleString("en-US", {
				timeZone: cardData[i].timeZone,
			});
			var hour = new Date(time).getHours();
			var minute = new Date(time).getMinutes();
			var timeAmPm;
			var updateExactTime = fetchedTileData.updateHourMinuteSecond(
				hour,
				minute,
				timeAmPm
			);
			cityAndTime.innerHTML = `${cardData[i].cityName}, ${updateExactTime.hour}:${updateExactTime.minute} ${updateExactTime.timeAmPm}`;
		}
	}

	var fetchedTileData = new SortedTile();

	// updateContinentOnClick, updateTemperatureOnClick functions are called once when the page is loaded.
	fetchedTileData.sortContinentTile();
	// updateContinentClick function is called when the continent arrow is clicked.
	document
		.getElementById("continent-arrow")
		.addEventListener("click", fetchedTileData.updateContinentOnClick);
	// updateTemperatureOnClick function is called when the temperature arrow is clicked.
	document
		.getElementById("temperature-arrow")
		.addEventListener("click", fetchedTileData.updateTemperatureOnClick);
}

/**
 * function which contain the call for fetching all the data from the api.
 * When the data is fetched, the loading gif will change to background image and the page will be displayed.
 *
 */
async function fetchTheData() {
	var fetchAllTheData = await getAllTheCityData();
	data = await arrayToObj(fetchAllTheData, "cityName");
	updateWeatherData().then(() => {
		document.getElementById("main-body").style.display = "block";
		document.body.style.backgroundImage = 'url("./Assets/background.svg")';
		document.body.style.backgroundSize = "100%";
	});
}
fetchTheData();
clearInterval(updateAlltheFetchedData);
clearInterval(updateFutureTemperature);
var updateAlltheFetchedData = setInterval(fetchTheData, 14400000);
var updateFutureTemperature = setInterval(updateWeatherData, 3600000);
export { iconSrc, data };
