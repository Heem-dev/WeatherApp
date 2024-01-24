const apiKey = "9a8146eb4e564879f6aabfbe095f751d";
const ipAPI = "https://api.ipify.org?format=json";

const cityName = document.querySelector("#search_bar");
const temp = document.querySelector('#temp')
const clouds = document.querySelector('#clouds')
const rain= document.querySelector('#rain')
const humid= document.querySelector('#humid')
const wind= document.querySelector('#wind')
const weekforecast= document.querySelector('#weekforecast')
let icon = document.querySelector('img#cloudicon')
let low = document.querySelector('div.low')
let high = document.querySelector('div.high')
const temphighlow = document.querySelector('#temphighlow')

const feels = document.querySelector('.feels')

let lati;
let long;

//fetching ip

fetch(ipAPI) 
.then((response) => response.json())
.then((data) => {
  console.log(data);
  // fetching city name from ip
  fetch('https://ipapi.co/'+data.ip+'/json/')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    weather(data.city)
  });
});

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
      "&lon="+long+"&units=metric&appid=" +
      apiKey
  );
  let json = await response.json();
  console.log(json);

  console.log(json.main.temp);

  temp.textContent = Math.round(json.main.temp)+" C°";

  icon.src = 'https://openweathermap.org/img/wn/'+json.weather[0].icon+'@2x.png'
  
  high.textContent = 'High: '+ Math.round(json.main.temp_max)
  low.textContent = "Low: "+Math.round(json.main.temp_min)
  // document.querySelector('#temp_container').append(icon)
  // temphighlow.append(high)
  // temphighlow.append(low)
  
  let description = json.weather[0].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  clouds.textContent = 'Clouds: '+description
  icon.title = description
  humid.textContent = 'Humidity: '+json.main.humidity+'%';
  wind.textContent = 'Wind Speed: '+json.wind.speed+' km/h'

  feels.textContent = 'Feels Like: '+Math.round(json.main.feels_like)+' C°'

  // document.querySelector('body').style.backgroundImage='url(https://source.unsplash.com/1920x1080/?'+city+')';

cityName.placeholder = city
}

document.querySelector("#search_bar").addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log(e);
    console.log(cityName);
    // weather(cityName)
    weather(cityName.value);
  }
});
