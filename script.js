const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  const timeEl = document.getElementById("time");
  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
  const dateEl = document.getElementById("date");
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
  getCurrentLocationWeather();
});

function updateWeatherIcon(condition) {
  let imgSrc;

  switch (condition) {
    case "Clear":
      imgSrc =
        "https://cdn.dribbble.com/users/622977/screenshots/6473478/weather-test-4.gif";
      break;
    case "Haze":
      imgSrc = "https://cdn-icons-png.flaticon.com/512/1779/1779807.png";
      break;
    case "Clouds":
      imgSrc = "https://lordicon.com/icons/wired/gradient/801-two-clouds.gif";
      break;
    case "Rain":
      imgSrc =
        "https://i.pinimg.com/originals/dd/e5/f4/dde5f4d61ca1f8b611a5014286a1cb71.gif";
      break;
    default:
      imgSrc =
        "https://media0.giphy.com/media/5XPmDz5wb8cj6/200w.gif?cid=6c09b952llcf0qvp2gdstmg7gyuwo8cpwgiwdapl2br10k2r&ep=v1_gifs_search&rid=200w.gif&ct=g";
  }

  return imgSrc;
}

async function getWeathere() {
  let key = "dd7fa73e412e7d4b26a84b058a427602";
  //let StackKey = "c184038f8899b4e2e3f4a9e503f77239";

  // https://api.weatherstack.com/current?access_key=${StackKey}&query=${city}

  try {
    let city = document.getElementById("city").value;
    localStorage.setItem("lastCity", city);

    clearWeatherUI();

    let res1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    );
    let data1 = await res1.json();
    let latitude = data1.coord.lat;
    let longitude = data1.coord.lon;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${key}`;

    let res = await fetch(url);
    let data = await res.json();
    showWeatherData(data);
    document.getElementById("city").value = "";
  } catch (err) {
    console.log("er:", err);
  } finally {
    console.log("Worked finally");
  }
}

async function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      fetchWeatherByCoordinates(lat, lon);
    }, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function fetchWeatherByCoordinates(lat, lon) {
  let key = "dd7fa73e412e7d4b26a84b058a427602";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${key}`;
  try {
    clearWeatherUI();
    let res = await fetch(url);
    let data = await res.json();
    showWeatherData(data);
  } catch (err) {
    console.log("er:", err);
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  const timezone = document.getElementById("time-zone");
  timezone.innerHTML = data.timezone;

  const countryEl = document.getElementById("country");
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  const currentWeatherItemsEl = document.getElementById(
    "current-weather-items"
  );
  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
  </div>
  <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure}pa</div>
  </div>
  <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
  </div>
  <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
  </div>
  <div class="weather-item">
  <div>Wind Speed</div>
  <div>${wind_speed} Km/h</div>
</div> `;
  const current_temp = document.getElementById("current-temp1");
  const current_temp2 = document.getElementById("current-temp2");

  let temp_show = document.createElement("div");
  temp_show.innerHTML = `<div class="tempBox-item">
  <div class="currentfont">Temp</div>
  <div class="currentfont">${data.current.temp}&#176;C</div>
</div>`;
  let current_description = document.createElement("p");
  current_description.textContent =
    "Weather- " + data.current.weather[0].description;
  let current_location = document.getElementById("city").value;
  let add_location = document.createElement("h4");
  add_location.textContent = current_location;
  let curent_logo = document.createElement("img");
  curent_logo.setAttribute("class", "image");
  const updatedImg = updateWeatherIcon(data.current.weather[0].main);
  curent_logo.src = updatedImg;

  current_temp.append(temp_show, current_description);
  current_temp2.append(add_location, curent_logo);

  let otherDayForecast = "";
  if (data && data.daily) {
    data.daily.slice(1).forEach((day) => {
      const iconSrc = updateWeatherIcon(day.weather[0].main);
      otherDayForecast += `
        <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img src="${iconSrc}" alt="weather icon" class="w-icon" width="100px" height="100px">
          <div class="temp">Night - ${day.temp.night}&#176;C</div>
          <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>`;
    });
  }
  const weatherForecastEl = document.getElementById("weather-forecast");
  weatherForecastEl.innerHTML = otherDayForecast;
}
function clearWeatherUI() {
  document.getElementById("current-temp1").innerHTML = "";
  document.getElementById("current-temp2").innerHTML = "";
  document.getElementById("current-weather-items").innerHTML = "";
  document.getElementById("weather-forecast").innerHTML = "";
}
