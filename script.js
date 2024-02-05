const apiKey = "9a8146eb4e564879f6aabfbe095f751d";
const ipAPI = "https://api.ipify.org?format=json";

const cityName = document.querySelector("#search_bar");
const temp = document.querySelector("#temp");
const clouds = document.querySelector("#clouds");
const rain = document.querySelector("#rain");
const humid = document.querySelector("#humid");
const wind = document.querySelector("#wind");
const weekforecast = document.querySelector("#week_forecast");
let icon = document.querySelector("img#cloudicon");
let low = document.querySelector("div.low");
let high = document.querySelector("div.high");
const temphighlow = document.querySelector("#temphighlow");
const todayName = document.querySelector(".todayName");
const feels = document.querySelector(".feels");

const cels = document.querySelector(".cels");
const fahr = document.querySelector(".fahr");
const tempformat = document.querySelector(".tempFormat");

let lati;
let long;
let formatSeleced = "C";

let selectedFormat = localStorage.getItem("selectedFormat") || "metric";
localStorage.setItem("selectedFormat", selectedFormat);

const toggleFormat = (format) => {
  selectedFormat = format;
  cels.classList.toggle("unselected", format === "imperial");
  fahr.classList.toggle("unselected", format === "metric");
  localStorage.setItem("selectedFormat", selectedFormat);
};

cels.addEventListener("click", () => toggleFormat("metric"));
fahr.addEventListener("click", () => toggleFormat("imperial"));

cels.classList.toggle("unselected", selectedFormat === "imperial");
fahr.classList.toggle("unselected", selectedFormat === "metric");

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

getCityFromIP(); // Get city from IP then call weather function
async function getCityFromIP() {
  const ip = await fetchData(ipAPI);
  const cityFromIP = await fetchData(`https://ipapi.co/${ip.ip}/json/`);
  weather(cityFromIP.city);
}

let speedFormat = "km/h";
async function weather(city) {
  const geoResponse = await fetchData(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );
  const [data] = geoResponse;
  long = data.lon;
  lati = data.lat;

  const urlRequest = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=${selectedFormat}&appid=${apiKey}`;
  const json = await fetchData(urlRequest);

  selectedFormat == "metric" ? (formatSeleced = "C") : (formatSeleced = "F");
  temp.textContent = `${Math.round(json.main.temp)} ${formatSeleced}°`;

  icon.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

  high.textContent = `High: ${Math.round(json.main.temp_max)}`;
  low.textContent = `Low: ${Math.round(json.main.temp_min)}`;

  selectedFormat == "metric" ? (speedFormat = "km/h") : (speedFormat = "mph");
  const dateNow = convertUnixToDate(json.dt);

  todayName.textContent = getDayOfWeek(dateNow);
  const description = capitalizeFirstLetter(json.weather[0].description);
  clouds.textContent = `Clouds: ${description}`;
  icon.title = description;
  humid.textContent = `Humidity: ${json.main.humidity}%`;
  wind.textContent = `Wind Speed: ${json.wind.speed} ${speedFormat}`;

  feels.textContent = `Feels Like: ${Math.round(json.main.feels_like)}`;
  const pressure = document.querySelector(".pressure");
  pressure.textContent = `Pressure: ${json.main.pressure} hPa`;

  cityName.placeholder = city;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=${selectedFormat}&appid=${apiKey}`;
  const forecastData = await fetchData(url);
  forecast(forecastData.list);
}

const forecastContainer = document.querySelector(".forecastContainer");

function forecast(list) {
  for (let i = 0, iter = 1; i < list.length; i += 8, iter++) {
    const item = list[i];
    updateForecastData(item, iter);
  }
}

document.querySelector("#search_bar").addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    weather(cityName.value);
  }
});

document.querySelector("#input_field> img").addEventListener("click", () => {
  weather(cityName.value);
});

function updateForecastData(dayWeatherData, iter) {
  const itemToEdit = document.querySelector(`.forecastItem:nth-child(${iter})`);
  const date = convertUnixToDate(dayWeatherData.dt);
  const day = getDayOfWeek(date);
  const description = capitalizeFirstLetter(
    dayWeatherData.weather[0].description
  );
  const icon = dayWeatherData.weather[0].icon;
  const highTemp = Math.round(dayWeatherData.main.temp_max);
  const lowTemp = Math.round(dayWeatherData.main.temp_min);
  const humidity = dayWeatherData.main.humidity;
  const windSpeed = dayWeatherData.wind.speed;
  const speedFormat = selectedFormat === "metric" ? "km/h" : "mph";

  itemToEdit.querySelector(".forecastDay").textContent = day;
  itemToEdit.querySelector(
    ".forecastIcon"
  ).src = `https://openweathermap.org/img/wn/${icon}.png`;
  itemToEdit.querySelector(".forecastIcon").title = description;
  itemToEdit.querySelector(
    ".high"
  ).textContent = `${highTemp} ${formatSeleced}°`;
  itemToEdit.querySelector(
    ".lowTemp"
  ).textContent = `${lowTemp} ${formatSeleced}°`;
  itemToEdit.querySelector(".forecastDescription").textContent = description;
  itemToEdit.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
  itemToEdit.querySelector(
    ".windSpeed"
  ).textContent = `Wind: ${windSpeed} ${speedFormat}`;
}

function capitalizeFirstLetter(string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function convertUnixToDate(unix) {
  return new Date(unix * 1000);
}

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}
