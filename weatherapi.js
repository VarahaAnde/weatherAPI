async function APICalling() {
    let input = document.querySelector('.city-state-input').value;
    
    let long = null;
    let lat = null;
    
    try {
        // First, get the coordinates for the city
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}`);
        const data = await response.json();
        
        // Reassign the values
        long = data.results[0].longitude;
        lat = data.results[0].latitude;
        
    } catch (error) {
        console.error('Error with data:', error);
    }
    
    try {

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`);
        const weatherData = await weatherResponse.json();
        console.log(weatherData);
        
        displayHourlyForecast(weatherData.hourly);

    } catch (error) {
        console.error('Error with data', error);
    }
}

document.querySelector('.city-state-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        APICalling();
    }
});

document.querySelector('.enter-button').addEventListener('click', () => {
    APICalling();
});

function displayHourlyForecast(hourly) {
    const hourlyForecastContainer = document.querySelector('.hourly-forecast');
    hourlyForecastContainer.innerHTML = ''; // Clear previous forecasts
    
    // Get the next 24 hours of data
    const times = hourly.time.slice(0, 24);
    const temperatures = hourly.temperature_2m.slice(0, 24);
    
    const now = new Date();
    
    times.forEach((time, index) => {
        // Create a box for each hour
        const hourBox = document.createElement('div');
        hourBox.className = 'hour-box';
        
        // Format the time (removing seconds and timezone)
        const formattedTime = time.split('T')[1].substring(0, 5);
        const futureTime = new Date(time);
        const hoursFromNow = Math.floor((futureTime - now) / (1000 * 60 * 60));
        // Display friendly time
        let timeDisplay;
        if (hoursFromNow === 1) {
            timeDisplay = 'Now';
        } else if (hoursFromNow === 2) {
            timeDisplay = 'In 1 hour';
        } else if (hoursFromNow > 2 && hoursFromNow < 25) {
            timeDisplay = `In ${hoursFromNow} hours`;
        } else {
            timeDisplay = formattedTime;
        }
        
        hourBox.innerHTML = `
            <div class="time-section">${timeDisplay}</div>
            <div class="temp-section">${temperatures[index]}°F</div>
        `;
        
        hourlyForecastContainer.appendChild(hourBox);
    });
}
