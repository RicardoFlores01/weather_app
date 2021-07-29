const iconElement = document.querySelector(".imgDescription");
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const locationElement = document.querySelector(".location");
const notificationElement = document.querySelector(".notification");
const timeElement = document.querySelector(".time");
const temperatureMin = document.querySelector(".temperature_min");
const temperatureMax = document.querySelector(".temperature_max");
const humidityElement = document.querySelector(".humidity_porcent");
const sunriseElement = document.querySelector(".sunrise_time");
const sunsetElement = document.querySelector(".sunset_time");
const tempChangeElement = document.querySelector(".temp_change");

const weather = {
    temperature: {
        value: 18,
        unit: "celsius"
    },
    description: "few clouds",
    iconId: "01d",
    city: "London",
    country: "GB",
    temp_min: {
        value: 10,
        unit: "celsius"
    },
    temp_max: {
        value: 20,
        unit: "celsisus"
    },
    humidity: 43,
    sunrise: "1627474814",
    sunset: "1627522267"
};

weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273;
const key = "31e382c5c8bcba8f7a9abd6ef60c9bc5";
// 82005d27a116c2880c8f0fcb866998a0

if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn´t support geolocation. Refresh the page.</p>";
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api);
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.temp_min.value = Math.floor(data.main.temp_min - KELVIN);
            weather.temp_max.value = Math.floor(data.main.temp_max - KELVIN);
            weather.humidity = data.main.humidity;
            weather.sunrise = data.sys.sunrise;
            weather.sunset = data.sys.sunset;
        })
        .then(function(){
            displayWeather();
        });
}

function timeZone() {
    var today = new Date();
    timeElement.innerHTML = `${today.getHours()}:${today.getMinutes()}`;
}

function RiseSet(riseSet, elementRiseSet, time) { 
    var date = new Date(1000*riseSet);
    var hours = date.getHours();
    var minutes = "0" +  date.getMinutes();
    var dateComplete = hours + ":" + minutes.substr(-2); 
    return elementRiseSet.innerHTML = `${dateComplete} ${time}`;
}

function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" width='35' height='35'/>`;
    temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
    descriptionElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    temperatureMin.innerHTML = `${weather.temp_min.value}° C`;
    temperatureMax.innerHTML = `${weather.temp_max.value}° C`;
    humidityElement.innerHTML = `${weather.humidity}%`;
    RiseSet(weather.sunrise, sunriseElement, 'AM');
    RiseSet(weather.sunset, sunsetElement, 'PM');
    timeZone();
}

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

tempChangeElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit === "celsius"){
        
        tempChangeElement.innerHTML = `° F`;
        let fahrenheit_min = celsiusToFahrenheit(weather.temp_min.value);
        fahrenheit_min = Math.floor(fahrenheit_min);
        temperatureMin.innerHTML = `${fahrenheit_min}° F`;
        weather.temp_min.unit = "fahrenheit";

        let fahrenheit_max = celsiusToFahrenheit(weather.temp_max.value);
        fahrenheit_max = Math.floor(fahrenheit_max);
        temperatureMax.innerHTML = `${fahrenheit_max}° F`;
        weather.temp_max.unit = "fahrenheit";

        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        temperatureElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempChangeElement.innerHTML = `° C`;
        temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = "celsius";
        
        temperatureMin.innerHTML = `${weather.temp_min.value}° C`;
        weather.temp_min.unit = "celsius";

        temperatureMax.innerHTML = `${weather.temp_max.value}° C`;
        weather.temp_max.unit = "celsius";
    }
});
