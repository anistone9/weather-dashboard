var searchFormEl = document.getElementById('search-form');
var cityInputEl = document.getElementById('city-name');
var forecastContainerEl = document.getElementById('forecast-container');
var forecastCardEl = document.getElementById('forecast-cards');
var apiKey = '010f510da36ea60a956c7518452bbcb1';

//Function for event handler (submit button) to retrieve user input (city data)
function formSubmitHandler(event) {
    event.preventDefault();
    //create connection to user input field in html
    //Tie event handler to API search
    //Use trim to remove leading and trailing white spaces from user input, if needed
    var searchCity = cityInputEl.value.trim();
    console.log(searchCity);

    //To DO: add if statement to check if input is null to alert user, or display results otherwise
    if (searchCity) {
        cityApi(searchCity);
        //Empty search box after running the initial city search
        //Empty the container of any previous information when running searchApri function
        forecastContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
}

//Function to fetch weather API using geographical coordinates
function cityApi(city) {
    //Variable for geocode url plus the api key (concatenated)
    var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=6&appid=' + apiKey;

    fetch(geocodeUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    //Run function to fetch city api using this geocode api
                    weatherApi(data);
                });
                //If there is a response but it's not ok, display this alert
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        //If there is an error in the fetch and there are no responses, display this alert
        .catch(function (error) {
            console.log(error);
            alert('Unable to connect to Geocode');
        });
}

//Function to display geocode results
function weatherApi(data) {
    //Variables storing the lat and lon obtained from the geocode api for the searched city
    var lat = data[0].lat;
    var lon = data[0].lon;
    //Variable for weather api by city plus the api key (concatenated)
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&cnt=45&appid=' + apiKey;



    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (weatherData) {
                    console.log(weatherData);
                    //Call display results function below
                    displayForecast(weatherData);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to reach Forecast');
        })
}

//Function to display searched city weather conditions with city name, weather icon, temperature, humidity, and wind speed
function displayForecast(forecastData) {
    //If user typed incorrect entry, return message below
    if (forecastData.length === 0) {
        forecastContainerEl.textContent = 'No weather information found';
        return;
    }

    var titleEl = document.createElement('h2');
    var newDate = new Date(forecastData.list[0].dt_txt);
    titleEl.textContent = forecastData.city.name + ' (' + newDate.toLocaleDateString() + ')';
    var iconCode = forecastData.list[0].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    var imageEl = document.createElement('img');
    imageEl.src = iconUrl;
    titleEl.appendChild(imageEl);
    forecastContainerEl.appendChild(titleEl);

    //Variables to display temperature, wind, and humidity
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidEl = document.createElement('p');

    var tempData = (forecastData.list[0].main.temp - 273.15) * 9 / 5 + 32;
    console.log(tempData);
    tempEl.innerHTML = 'Temp: ' + tempData.toFixed(2) + '°F';
    forecastContainerEl.appendChild(tempEl);
    console.log(tempEl);

    var windData = forecastData.list[0].wind.speed;
    console.log(windData);
    windEl.innerHTML = 'Wind: ' + windData + 'mph';
    forecastContainerEl.appendChild(windEl);
    console.log(windEl);

    var humidityData = forecastData.list[0].main.humidity;
    console.log(humidityData);
    humidEl.innerHTML = 'Humidity: ' + humidityData + '%';
    forecastContainerEl.appendChild(humidEl);
    console.log(humidEl);

    displayFiveDays(forecastData);
}

//Function to display 5-day forecast with the same data categories as above
function displayFiveDays(forecastData) {
    for (var i = 0; i < 5; i++) {
        var titleEl = document.createElement('h2');
        var newDate = new Date(forecastData.list[i * 8].dt_txt);
        titleEl.textContent = forecastData.city.name + ' (' + newDate.toLocaleDateString() + ')';
        var iconCode = forecastData.list[i * 8].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var imageEl = document.createElement('img');
        imageEl.src = iconUrl;
        titleEl.appendChild(imageEl);
        forecastCardEl.appendChild(titleEl);

        var forecastDayCards = document.createElement('div');
        forecastDayCards.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
        forecastCardEl.appendChild(forecastDayCards);
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidEl = document.createElement('p');

        var tempData = (forecastData.list[i * 8].main.temp - 273.15) * 9 / 5 + 32;
        tempEl.innerHTML = 'Temp: ' + tempData.toFixed(2) + '°F';
        forecastDayCards.appendChild(tempEl);

        var windData = forecastData.list[i * 8].wind.speed;
        windEl.innerHTML = 'Wind: ' + windData + 'mph';
        forecastDayCards.appendChild(windEl);

        var humidityData = forecastData.list[i * 8].main.humidity;
        humidEl.innerHTML = 'Humidity: ' + humidityData + '%';
        forecastDayCards.appendChild(humidEl);
    }
}
//Function to store searched city and weather results
function storeCityForecast() {

}
//Function to retrieve local storage data and display it when the button for that city is clicked
function retrieveCityForecast() {

}
//Function for event handler (button for each stored city)
function storedForecastHandler(event) {

}
//Calls for the functions above
searchFormEl.addEventListener('submit', formSubmitHandler);