const apiKey = "9a8146eb4e564879f6aabfbe095f751d";
const ipAPI = "https://api.ipify.org?format=json";

const cityName = document.querySelector("#search_bar");
const temp = document.querySelector("#temp");
const clouds = document.querySelector("#clouds");
const rain = document.querySelector("#rain");
const humid = document.querySelector("#humid");
const wind = document.querySelector("#wind");
const weekforecast = document.querySelector("#weekforecast");
let icon = document.querySelector("img#cloudicon");
let low = document.querySelector("div.low");
let high = document.querySelector("div.high");
const temphighlow = document.querySelector("#temphighlow");
const todayName = document.querySelector(".todayName");
const feels = document.querySelector(".feels");

let lati;
let long;
let formatSeleced = "C";
const tempformat = document.querySelector(".tempFormat");

let selectedFormat = "metric";
selectedFormat = localStorage.getItem("selectedFormat");

localStorage.setItem("selectedFormat", selectedFormat);

// set a local storage item for the selected format.

// get the selected format from local storage.

tempformat.querySelector(".cels").addEventListener("click", () => {
  selectedFormat = "metric";

  tempformat.querySelector(".cels").classList.remove("unselected");
  tempformat.querySelector(".fahr").classList.add("unselected");

  localStorage.setItem("selectedFormat", selectedFormat);

  console.log(selectedFormat);
});

console.log(selectedFormat);

tempformat.querySelector(".fahr").addEventListener("click", () => {
  selectedFormat = "imperial";

  tempformat.querySelector(".cels").classList.add("unselected");
  tempformat.querySelector(".fahr").classList.remove("unselected");

  localStorage.setItem("selectedFormat", selectedFormat);

  console.log(selectedFormat);
});

if (selectedFormat === "metric") {
  tempformat.querySelector(".cels").classList.remove("unselected");
  tempformat.querySelector(".fahr").classList.add("unselected");
}
if (selectedFormat === "imperial") {
  tempformat.querySelector(".cels").classList.add("unselected");
  tempformat.querySelector(".fahr").classList.remove("unselected");
}

//fetching ip

fetch(ipAPI)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // fetching city name from ip
    fetch("https://ipapi.co/" + data.ip + "/json/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        weather(data.city);
      });
  });

let speedFormat = "km/h";
async function weather(city) {
  //geocoding city cords

  await fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      apiKey
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      long = data[0].lon;
      lati = data[0].lat;
      console.log(lati);
      console.log(long);
    });

  // fetching weather data
  let response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lati +
      "&lon=" +
      long +
      "&units=" +
      selectedFormat +
      "&appid=" +
      apiKey
  );
  let json = await response.json();
  console.log(json);

  console.log(json.main.temp);
  if (selectedFormat === "metric") {
    formatSeleced = "C";
  }
  if (selectedFormat === "imperial") {
    formatSeleced = "F";
  }
  temp.textContent = Math.round(json.main.temp) + " " + formatSeleced + "°";

  icon.src =
    "https://openweathermap.org/img/wn/" + json.weather[0].icon + "@2x.png";

  high.textContent = "High: " + Math.round(json.main.temp_max);
  low.textContent = "Low: " + Math.round(json.main.temp_min);
  // document.querySelector('#temp_container').append(icon)
  // temphighlow.append(high)
  // temphighlow.append(low)

  if (selectedFormat === "imperial") {
    speedFormat = "mph";
  }
  if (selectedFormat === "metric") {
    speedFormat = "km/h";
  }

  let dateNow = new Date(json.dt * 1000).getDay();

  todayName.textContent = daysOfWeek[dateNow];
  console.log(dateNow);
  console.log(daysOfWeek[dateNow]);
  let description = json.weather[0].description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  clouds.textContent = "Clouds: " + description;
  icon.title = description;
  humid.textContent = "Humidity: " + json.main.humidity + "%";
  wind.textContent = "Wind Speed: " + json.wind.speed + " " + speedFormat;

  feels.textContent = "Feels Like: " + Math.round(json.main.feels_like);

  cityName.placeholder = city;

  // 5 day forecast API request
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=${selectedFormat}&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.list);
      forecast(data.list);
    });
}
const forecastContainer = document.querySelector(".forecastContainer");
function forecast(list) {
  forecastContainer.innerHTML = "";
  for (let i = 0; i < list.length; i += 8) {
    const item = list[i];
    let date = new Date(item.dt * 1000);
    let day = date.getDay();
    let time = date.getHours();
    console.log(daysOfWeek[day]);
    console.log(time);

    let forecastItem = document.createElement("div");
    forecastItem.classList.add("forecastItem");
    let forecastDay = document.createElement("div");
    forecastDay.classList.add("forecastDay");
    forecastDay.textContent = daysOfWeek[day];
    forecastItem.append(forecastDay);

    let forecastIcon = document.createElement("img");
    forecastIcon.classList.add("forecastIcon");
    forecastIcon.src =
      "https://openweathermap.org/img/wn/" + item.weather[0].icon + ".png";
    forecastItem.append(forecastIcon);

    let highTemp = document.createElement("div");
    highTemp.classList.add("high");
    highTemp.textContent =
      Math.round(item.main.temp_max) + " " + formatSeleced + "°";

    let lowTemp = document.createElement("div");
    lowTemp.classList.add("lowTemp");
    lowTemp.textContent =
      Math.round(item.main.temp_min) + " " + formatSeleced + "°";

    forecastItem.append(highTemp);
    forecastItem.append(lowTemp);
    forecastContainer.append(forecastItem);
  }
}
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
document.querySelector("#search_bar").addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log(e);
    console.log(cityName);
    // weather(cityName)
    weather(cityName.value);
  }
});

document.querySelector("#input_field> img").addEventListener("click", () => {
  weather(cityName.value);
});
