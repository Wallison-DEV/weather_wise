document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formulary');
    const cityInput = document.getElementById('input-city');
    const cityName = document.getElementById('cidade');
    const currentTemperature = document.getElementById('currentTemperature');
    const weatherDescription = document.getElementById('descricao');
    const humidity = document.getElementById('umidade');
    const forecastContainer = document.getElementById('previsao-tempo');
    const dataClima = document.querySelector('.dataClima');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city === '') {
            alert('Por favor, digite o nome da cidade.');
            return;
        }
        const apiKey = 'b70cbe7773101c4c4d55344c63883679'; 
        const apiUrlID = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;
        
        try {
            const response = await fetch(apiUrlID);
            if (!response.ok) {
                throw new Error('Não foi possível obter os dados do tempo para essa cidade.');
            }
            const data = await response.json();

            const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            document.getElementById('weatherIcon').innerHTML = `<img src="${weatherIcon}" alt="${data.weather[0].description}">`;

            cityName.textContent = data.name;
            currentTemperature.textContent = data.main.temp;
            weatherDescription.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
            humidity.textContent = `${data.main.humidity}%`;

            const weekday = new Date(data.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long' });
            dataClima.textContent = weekday.charAt(0).toUpperCase() + weekday.slice(1);
            document.getElementById('ventos').textContent = `${data.wind.speed} m/s`;

            const cityId = data.id;

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric&lang=pt`;
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                throw new Error('Não foi possível obter a previsão do tempo para essa cidade.');
            }
            const forecastData = await forecastResponse.json();
            console.log(forecastData);

            forecastContainer.innerHTML = '';


            forecastData.list.forEach(forecast => {
                const date = new Date(forecast.dt_txt);
                const weekdayAbbreviation = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
                const tempMax = forecast.main.temp_max.toFixed(1);
                const tempMin = forecast.main.temp_min.toFixed(1);
            
                const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            
                const forecastElement = document.createElement('div');
                forecastElement.classList.add('forecast-item');
                forecastElement.innerHTML = `
                    <p>${weekdayAbbreviation} ${time}
                    <div id="forecast_description"><img src="${weatherIcon}" alt=""><span id="descricao">${forecast.weather[0].description.charAt(0).toUpperCase() + forecast.weather[0].description.slice(1)}</span></div>
                    <p>Umidade: ${forecast.main.humidity}%</p>
                    <p>${tempMax}° <span class="tempMin">${tempMin}°</span></p>
                `;
                forecastContainer.appendChild(forecastElement);
            });            
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
        }
    });
});
