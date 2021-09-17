const apiUrlToday =
  "https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=3340cbe473b3001d4487c919d349bee2";
const apiUrlFiveDays =
  "https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=3340cbe473b3001d4487c919d349bee2";

const gradientBackground = document.getElementById("gradient-background");
const mainContent = document.getElementById("main-content");
const todaysWeatherSmall = document.getElementById("todays-weather-small");
const todaysWeather = document.getElementById("todays-weather");
const weeksWeather = document.getElementById("weeks-weather");
const cityHeader = document.getElementById("city");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

fetch(apiUrlToday)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw "Oops, something went wrong!";
    }
  })
  .then((data) => {
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
      "sv-SE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString(
      "sv-SE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // prints temperature, sunrise and sunset to top of page
    todaysWeatherSmall.innerHTML = `
      <p>${data.weather[0].description} | ${data.main.temp.toFixed(1)} &#176 
      <p>sunrise ${sunrise.replace(":", ".")}</p>
      <p>sunset ${sunset.replace(":", ".")}</p>
    `;

    const weatherMain = data.weather[0].main;
    // shows different text, image and background-color depending on the weather
    switch (weatherMain) {
      case "Clear":
        mainContent.style.backgroundColor = "#F7E9B9";
        mainContent.style.color = "#2A5510";
        mainContent.style.border = "3px solid #2a5510";
        todaysWeather.innerHTML = `
          <img class="weather-image" src=${"./assets/sunglasses.svg"} alt=${"a pair of sunglasses"} />
          <h1>Get your sunnies on. ${
            data.name
          } is looking rather great today.</h1>
        `;
        break;
      case "Rain" && "Thunderstorm" && "Drizzle" && "Mist":
        mainContent.style.backgroundColor = "#A3DEF7";
        mainContent.style.color = "#164A68";
        mainContent.style.border = "3px solid #164A68";
        todaysWeather.innerHTML = `
          <img class="weather-image" src=${"./assets/umbrella.svg"} alt=${"an umbrella"} />
          <h1>Don't forget your umbrella. It's wet in ${data.name} today.</h1>
        `;
        break;
      default:
        gradientBackground.style.backgroundImage =
          "linear-gradient(147deg, #959898 0%, #ffffff 74%)";
        mainContent.style.backgroundColor = "#F4F7F8";
        mainContent.style.color = "#F47775";
        mainContent.style.border = "3px solid #F47775";
        todaysWeather.innerHTML = `
            <img class="weather-image" src=${"./assets/cloud.svg"} alt=${"a cloud"} />
            <h1>Light a fire and get cosy. ${
              data.name
            } is looking grey today.</h1>
          `;
    }
  })
  .catch((error) => console.error(error));

fetch(apiUrlFiveDays)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw "Oops, something went wrong!";
    }
  })
  .then((data) => {
    //prints weekday and temperature for the next five days
    const filteredForecast = data.list.filter((day) =>
      day.dt_txt.includes("12:00")
    );
    filteredForecast.forEach((day) => {
      const forecastDay = new Date(day.dt_txt);
      weeksWeather.innerHTML += `
      <div class='weekdays-container'><div class='day-container'>${forecastDay
        .toLocaleString("en-us", { weekday: "short" })
        .toLowerCase()}</div><div class='temp-container'>${day.main.temp.toFixed(
        0
      )} &#176</div></div>
    `;
    });
  })
  .catch((error) => console.error(error));
