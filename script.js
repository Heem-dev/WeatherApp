const apiKey = "9a8146eb4e564879f6aabfbe095f751d";
let cityName = document.querySelector("#search_bar");
let lati;
let long;
async function weather(city) {
  //geocoding city cords

  await fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
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
      "&lon="+long+"&appid=" +
      apiKey
  );
  let json = await response.json();
  console.log(json);
}

document.querySelector("#search_bar").addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log(e);
    console.log(cityName);
    // weather(cityName)
    weather(cityName.value);
  }
});
