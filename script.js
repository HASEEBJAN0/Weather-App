const weatherIcons = {
    "Clear": "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
    "Clouds": "https://cdn-icons-png.flaticon.com/512/1163/1163658.png",
    "Few clouds": "https://cdn-icons-png.flaticon.com/512/1163/1163660.png",
    "Scattered clouds": "https://cdn-icons-png.flaticon.com/512/1163/1163660.png",
    "Broken clouds": "https://cdn-icons-png.flaticon.com/512/1163/1163658.png",
    "Shower rain": "https://cdn-icons-png.flaticon.com/512/1163/1163659.png",
    "Rain": "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
    "Thunderstorm": "https://cdn-icons-png.flaticon.com/512/1163/1163655.png",
    "Snow": "https://cdn-icons-png.flaticon.com/512/1163/1163654.png",
    "Mist": "https://cdn-icons-png.flaticon.com/512/1163/1163653.png",
    "Smoke": "https://cdn-icons-png.flaticon.com/512/1163/1163649.png",
    "Haze": "https://cdn-icons-png.flaticon.com/512/1163/1163649.png",
    "Dust": "https://cdn-icons-png.flaticon.com/512/1163/1163649.png",
    "Fog": "https://cdn-icons-png.flaticon.com/512/1163/1163653.png",
    "Sand": "https://cdn-icons-png.flaticon.com/512/1163/1163649.png",
    "Ash": "https://cdn-icons-png.flaticon.com/512/1163/1163649.png",
    "Squall": "https://cdn-icons-png.flaticon.com/512/1163/1163655.png",
    "Tornado": "https://cdn-icons-png.flaticon.com/512/1163/1163655.png",
    "Drizzle": "https://cdn-icons-png.flaticon.com/512/1163/1163656.png",
    "Night Clear": "https://cdn-icons-png.flaticon.com/512/1163/1163671.png",
    "Night Clouds": "https://cdn-icons-png.flaticon.com/512/1163/1163668.png",
    "Night Rain": "https://cdn-icons-png.flaticon.com/512/1163/1163662.png",
    "Night Thunderstorm": "https://cdn-icons-png.flaticon.com/512/1163/1163663.png",
    "Night Snow": "https://cdn-icons-png.flaticon.com/512/1163/1163654.png",
    "Night Mist": "https://cdn-icons-png.flaticon.com/512/1163/1163653.png"
};



async function getWeather() {
    console.log("button was clicked")
    try {
        let ApiKey = 'ce8302bf3e75a6f7ae1baf5d20d81d7a';
        let cityName = document.getElementById("city-name").value
        let CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}&units=metric`

        let HOURLY_AND_FIVE_DAYS_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${ApiKey}&units=metric`

        let cuurent_weather = await fetch(CURRENT_WEATHER_URL)
        let hourly_and_five_days_weather = await fetch(HOURLY_AND_FIVE_DAYS_FORECAST_URL)

        if (!cuurent_weather.ok && !hourly_and_five_days_weather.ok) {
            let current_ERROR = await cuurent_weather.json()
            let hourly_ERROR = await hourly_and_five_days_weather.json()
            throw new Error(`Hourly API HTTP Error: ${hourly_ERROR.message} ` || `CURRENT API HTTP Error: ${current_ERROR.message} `);
        }
        let CurrentData = await cuurent_weather.json()
        let HourlyData = await hourly_and_five_days_weather.json()
        // console.log("CURRENT DATA ", CurrentData)
        console.log("HOURLY DATA ", HourlyData)

        // CURRENT WEATHER DATA

        let currentWeatherDesc = CurrentData.weather[0].main
        let currentTemp = Math.round(CurrentData.main.temp)
        let currentIconURL = weatherIcons[currentWeatherDesc]
        let currentCity = CurrentData.name
        let currentTempMax = Math.round(CurrentData.main.temp_max)
        let currentTempMin = Math.round(CurrentData.main.temp_min)
        let humidity = CurrentData.main.humidity
        let visibility = CurrentData.visibility / 1000
        let feels_like = CurrentData.main.feels_like
        let pressure = CurrentData.main.pressure

        // NEXT 5 DAYS WEATHER DATA
        let daysForecastDiv = document.getElementById("forecast-list")
        daysForecastDiv.innerHTML = ""
        
        for (let i = 0; i < HourlyData.list.length; i++) {
            // let utcTime = new Date(HourlyData.list[i].dt_txt).getTime();
            let dt = HourlyData.list[i].dt_txt.split(' ')[0]
            let utcTime = new Date(dt).getTime()
            let cityTime = new Date(utcTime + HourlyData.city.timezone * 1000);
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let dayName = days[cityTime.getUTCDay()];
            let daily_MIN_Tem = Math.round(HourlyData.list[i].main.temp_min)
            let daily_MAX_Tem = Math.round(HourlyData.list[i].main.temp_max)
            let time = HourlyData.list[i].dt_txt.split(' ')[1]
            let dailyIcon = HourlyData.list[i].weather[0].main

            let dailyIconURL = weatherIcons[dailyIcon]
            // console.log(dailyIconURL);
            if (time === '12:00:00') {
                //  console.log("MAX TEMP ",daily_MAX_Tem , " MIN TEMP ",daily_MIN_Tem)
                daysForecastDiv.innerHTML += `<div class="forecast-item">
                            <p>${dayName}</p><img src=${dailyIconURL} alt="">
                            <p>H${daily_MAX_Tem}°/L${daily_MIN_Tem}°</p>
                        </div>`


            }
            // let dt = new Date(HourlyData.list[i].dt_txt + " UTC");

            // console.log(  i +" : Date : "+  dt);

        }

        let left = document.getElementById("left")
        left.innerHTML = `
        <h2>${currentCity}</h2>
                <img src=${currentIconURL} alt="">
                <div class="temp">
                    <h1>${currentTemp}</h1><span>°C</span>
                </div>
                <p class="status">${currentWeatherDesc}</p>
                <p class="hl">H: ${currentTempMax}<span>°C</span> / L: ${currentTempMin}<span>°C</span></p>
                `

        //  HOURLY WEATHER DATA

        let hourlyDiv = document.getElementById("hourly")
        hourlyDiv.innerHTML = ""
        // let utcTime = new Date(HourlyData.list[0].dt_txt).getTime(); // UTC timestamp in ms
        // console.log( "Time " + utcTime);
        // console.log("Time Zone " + HourlyData.city.timezone);
        // console.log("City Time " + new Date(utcTime + HourlyData.city.timezone * 1000));


        for (var i = 0; i < 8; i++) {

            let utcTime = new Date(HourlyData.list[i].dt_txt).getTime(); // UTC timestamp in ms
            let cityTime = new Date(utcTime + HourlyData.city.timezone * 1000); // city local time
            let hour = cityTime.getUTCHours(); // ab ye city ka local hour hai

            let amPm = hour >= 12 ? "PM" : "AM"
            let hour12 = hour === 0 ? hour = 12 : (hour > 12 ? hour % 12 : hour)
            let temp = Math.round(HourlyData.list[i].main.temp)
            let icon = HourlyData.list[i].weather[0].main
            let iconURL = weatherIcons[icon]
            hourlyDiv.innerHTML += `
                    <div class="hour">
                        <p>${hour12} ${amPm}</p><img src=${iconURL}>
                        <h4>${temp}°</h4>
                    </div>
                    `

        }



        let bottomDiv = document.getElementById("bottom")
        // console.log(rightDiv)

        bottomDiv.innerHTML = `

                
                    <h3>Air Quality & More</h3>
                    <div class="info-grid">
                        <div class="info-box">
                            <p>Pressure<br><strong>${pressure}hPa</strong></p>
                        </div>
                        <div class="info-box">
                            <p>Feels Like<br><strong>${feels_like}°</strong></p>
                        </div>
                        <div class="info-box">
                            <p>Humidity<br><strong>${humidity}%</strong></p>
                        </div>
                        <div class="info-box">
                            <p>Visibility<br><strong>${visibility}KM</strong></p>
                        </div>
                    </div>
                `

    } catch (error) {
        if (error.name === "TypeError") {
            alert("❌ Network Error: Server ya Internet issue");
        } else {
            alert("⚠️ Error:", error);
        }
        return null;
    }
}








































//data.list



















// const minute = 1000 * 60;
// const hour = minute * 60;
// const day = hour * 24;
// const year = day * 365;
// const d = Date.now();
// console.log(Math.round(d )