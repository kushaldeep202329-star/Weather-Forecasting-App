const API_KEY = "cf120148f1bb39a54610aceceff8cb50";   

function convertTime(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
}


function setTheme(weather) {
    const body = document.body;

    if (weather.includes("rain")) {
        body.style.background = "linear-gradient(#4b79a1, #283e51)";
    }
    else if (weather.includes("snow")) {
        body.style.background = "linear-gradient(#e6efff, #a1c4fd)";
    }
    else if (weather.includes("thunder")) {
        body.style.background = "linear-gradient(#434343, #000000)";
    }
    else if (weather.includes("cloud")) {
        body.style.background = "linear-gradient(#d7d2cc, #304352)";
    }
    else {
        body.style.background = "linear-gradient(#4facfe, #00f2fe)";
    }
}

async function getWeather() {
    let city = document.getElementById("city").value;
    if (!city) return alert("Enter a city");

    document.getElementById("loader").classList.remove("hidden");

    let currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    let forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        // Fetch current weather
        let response = await fetch(currentUrl);
        let data = await response.json();

        if (data.cod === "404") {
            document.getElementById("error").textContent = "City Not Found!";
            document.getElementById("loader").classList.add("hidden");
            return;
        }

        document.getElementById("weather-card").classList.remove("hidden");
        document.getElementById("error").textContent = "";

        document.getElementById("city-name").textContent = data.name;
        document.getElementById("temp").textContent = data.main.temp + "°C";
        document.getElementById("description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = data.main.humidity;
        document.getElementById("wind").textContent = data.wind.speed;

        document.getElementById("sunrise").textContent = convertTime(data.sys.sunrise);
        document.getElementById("sunset").textContent = convertTime(data.sys.sunset);

        document.getElementById("icon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


        setTheme(data.weather[0].description.toLowerCase());

        // Fetch forecast
        let fResponse = await fetch(forecastUrl);
        let fData = await fResponse.json();

        document.getElementById("forecast-title").classList.remove("hidden");

        let forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";

        
        let used = {};

        fData.list.forEach(item => {
            let date = item.dt_txt.split(" ")[0];

            if (!used[date] && item.dt_txt.includes("12:00:00")) {
                used[date] = true;

                forecastContainer.innerHTML += `
                    <div class="forecast-day">
                        <p>${date}</p>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" />
                        <p>${item.main.temp}°C</p>
                    </div>
                `;
            }
        });

        document.getElementById("loader").classList.add("hidden");

    } catch (error) {
        document.getElementById("error").textContent = "Error fetching data";
        document.getElementById("loader").classList.add("hidden");
    }
}
