// This function fetches data for a country based on the user's input
async function fetchCountryData() {
    // Get the country name from the input field
    const countryName = document.getElementById('countryInput').value;

    // Check if the input is empty and alert the user if it is
    // I did this to ensure the user provides a country name before making an API call
    if (!countryName) {
        alert('Please enter a country name');
        return;
    }

    try {
        // Fetch data from the RestCountries API using the country name
        // I used the fetch API because it's a modern and clean way to make HTTP requests
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        // Check if the response is not OK and throw an error if it's not
        // This helps handle cases where the country is not found
        if (!response.ok) {
            throw new Error('Country not found');
        }

        // Parse the JSON response and get the country data
        const countryData = await response.json();

        // Display the country information using the displayCountryInfo function
        // I did this to separate the concerns of fetching data and displaying it
        displayCountryInfo(countryData[0]);
    } catch (error) {
        // Log any errors to the console and display an error message to the user
        // This ensures the user knows if something went wrong
        console.error('Error fetching country data:', error);
        document.getElementById('countryInfo').innerHTML = `<p>${error.message}</p>`;
    }
}

// This function displays the country information on the webpage
function displayCountryInfo(country) {
    // Get the div where the country information will be displayed
    const countryInfoDiv = document.getElementById('countryInfo');

    // Extract the currencies and languages from the country data
    // I used Object.keys and Object.values to handle cases where the data might be missing
    const currencies = Object.keys(country.currencies || {}).join(', ');
    const languages = Object.values(country.languages || {}).join(', ');

    // Set the inner HTML of the country info div to display the country information
    // I used template literals for cleaner and more readable string interpolation
    countryInfoDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
        <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Currencies:</strong> ${currencies}</p>
        <p><strong>Languages:</strong> ${languages}</p>
    `;
}
