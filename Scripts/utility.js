import { iconSrc, data } from "./index.js";
export function importCityDataToDatalist() {
	const cities = document.getElementById("city-list");
	for (var city in data) {
		var options = document.createElement("OPTION");
		options.value = data[city].cityName;
		cities.appendChild(options);
	}
}

export function updateUI(UIElementID, UIAttribute, valueToUpdate) {
	if (UIAttribute == "src") {
		document.getElementById(UIElementID).src = valueToUpdate;
	} else if (UIAttribute == "innerHTML") {
		document.getElementById(UIElementID).innerHTML = valueToUpdate;
	} else if (UIAttribute == "style.borderBottom") {
		document.getElementById(UIElementID).style.borderBottom = valueToUpdate;
	}
}
/**
 * Function to get the array name. If sunny icon is selected then sunnyCities array name is returned.
 * If snowflakeIcon is selected then coldcities array name is returned.
 * If both are not selected then rainyCities array name is returned.
 *
 * @return {Array} the array name is returned
 */
export function selectIcon() {
	if (iconSrc == "sunnyIcon") {
		return this.sunnyIcon;
	} else if (iconSrc == "snowflakeIcon") {
		return this.snowflakeIcon;
	} else {
		return this.rainyIcon;
	}
}
/**
 * Function will set a border bottom line with blue color.
 *
 * @param {string} iconSrc which is checked to find the selected icon.
 */
export function setBorder(iconSrc) {
	if (iconSrc == "sunnyIcon") {
		updateUI("sunny", "style.borderBottom", "2px solid #00C0F1");
		updateUI("snow", "style.borderBottom", "none");
		updateUI("rainy", "style.borderBottom", "none");
	} else if (iconSrc == "snowflakeIcon") {
		updateUI("snow", "style.borderBottom", "2px solid #00C0F1");
		updateUI("sunny", "style.borderBottom", "none");
		updateUI("rainy", "style.borderBottom", "none");
	} else {
		updateUI("rainy", "style.borderBottom", "2px solid #00C0F1");
		updateUI("sunny", "style.borderBottom", "none");
		updateUI("snow", "style.borderBottom", "none");
	}
}
/**
 * Function will be called when the scroll arrow button is clicked.
 *
 */
export function scrollOverFlowContent() {
	var arrowButton = document.getElementsByClassName("back-front-arrow");
	var content = document.getElementById("box-container");
	arrowButton[0].addEventListener("click", function () {
		content.scrollLeft -= 600;
	});
	arrowButton[1].addEventListener("click", function () {
		content.scrollLeft += 600;
	});
}
/**
 * Function to convert array to object. The data of all the city which is fetched will be in array.
 * Those data is converted to objected.
 *
 * @param {Array} arr
 * @param {string}} key
 * @return {object} 
 */
 export const arrayToObj = (arr, key) => {
	return arr.reduce((dataObject, item) => {
		dataObject[item[key].toLowerCase()] = item;
		return dataObject;
	}, {});
};
