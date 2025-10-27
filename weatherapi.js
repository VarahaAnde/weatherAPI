document.querySelector('.enter-button').addEventListener('click', async () => {
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

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`);
        const weatherData = await weatherResponse.json();
        console.log(weatherData);

    } catch (error) {
        console.error('Error with data', error);
    }
});
