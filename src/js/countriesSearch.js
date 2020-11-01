import countryForm from "../templates/countries.hbs";
import countriesFetch from "./countriesFetch.js";
import _ from "lodash";
import { info, error } from '@pnotify/core';



const refs = {
	input: document.querySelector(".js-countryNameArea"),
	output: document.querySelector(".js-response"),
	clearBtn: document.querySelector(".js-clear"),
}
let listOfLinks = null;

refs.input.addEventListener("input", _.debounce(makeRequest, 500));
refs.clearBtn.addEventListener("click", clearAll);

function makeRequest() {
	refs.output.innerHTML = "";
	if (listOfLinks) { clearListener() };
	if (refs.input.value) {
		countriesFetch(refs.input.value).then(data => {
			if (!data) {
				info({ text: "Found nothing, try differently" });
			} else parseData(data);
		})
	};
}

function parseData(data) {
	if (data.length > 10) {
		error({ text: "Too many countries, try to specify the request" });
	} else if (data.length > 1) {
		refs.output.insertAdjacentHTML("afterbegin", `<ul class="simple-list">${data.reduce((acc, { name }) => acc + `<li><a href="#">${name}</a></li>`, "")}</ul>`);
		listOfLinks = document.querySelector(".simple-list");
		listOfLinks.addEventListener("click", showSelectedCountry);
	} else {
		refs.output.insertAdjacentHTML("afterbegin", countryForm(data[0]));
	}
}

function showSelectedCountry(event) {
	const countryName = event.target.innerText;
	refs.input.value = countryName;
	refs.output.innerHTML = "";
	countriesFetch(countryName).then(data => {
		const singleCountry = data.filter(({ name }) => name.toLowerCase() === countryName.toLowerCase())[0];
		refs.output.insertAdjacentHTML("afterbegin", countryForm(singleCountry));
	})
	clearListener();
}

function clearListener() {
	listOfLinks.removeEventListener("click", showSelectedCountry);
	listOfLinks = null;
}

function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
	if (listOfLinks) { clearListener() };
}