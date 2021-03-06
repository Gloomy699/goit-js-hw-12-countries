export default function countriesFetch(searchQuery) {
	return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
		.then(response => {
			if (response.ok) return response.json();
		})
		.catch(error => console.log(error));
}