document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'afc045b2dbafa5dcbbbb2877f4d0df26';

    function fetchWeatherDataByCoords(latitude, longitude) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=pt_br`;

        console.log(`URL gerada (coordenadas): ${url}`);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados. Verifique as permissões de localização.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos (coordenadas):', data);
                displayWeatherData(data);
            })
            .catch(error => {
                document.getElementById('error-message').textContent = error.message;
                console.error('Erro ao obter dados:', error);
            });
    }

    function fetchWeatherDataByCity(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

        console.log(`URL gerada (cidade): ${url}`);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos (cidade):', data);
                displayWeatherData(data);
            })
            .catch(error => {
                document.getElementById('error-message').textContent = error.message;
                console.error('Erro ao obter dados:', error);
            });
    }

    function displayWeatherData(data) {
        const weatherContainer = document.querySelector('.weather-container');
        const weatherDescription = data.weather[0].description.toLowerCase();
        const currentHour = new Date().getHours();

        console.log(`Descrição do clima: ${weatherDescription}`);

        document.getElementById('location').textContent = `Localização: ${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `Temperatura: ${data.main.temp.toFixed(1)}°C`;
        document.getElementById('feels-like').textContent = `Sensação Térmica: ${data.main.feels_like.toFixed(1)}°C`;
        document.getElementById('description').textContent = `Descrição: ${weatherDescription}`;
        document.getElementById('error-message').textContent = '';

        weatherContainer.classList.remove('sunny-day', 'sunny-afternoon', 'cloudy', 'rainy', 'foggy', 'night');

        if (weatherDescription.includes('clear') || weatherDescription.includes('sun')) {
            if (currentHour >= 6 && currentHour < 18) {
                weatherContainer.classList.add('sunny-day'); // Dia ensolarado
            } else {
                weatherContainer.classList.add('night'); // Noite
            }
        } else if (weatherDescription.includes('clouds') || weatherDescription.includes('overcast')) {
            weatherContainer.classList.add('cloudy');
        } else if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle') || weatherDescription.includes('showers')) {
            weatherContainer.classList.add('rainy');
        } else if (weatherDescription.includes('fog') || weatherDescription.includes('haze')) {
            weatherContainer.classList.add('foggy');
        } else {
            weatherContainer.classList.add('night'); // Caso não se encaixe em outras categorias
        }
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherDataByCoords(latitude, longitude);
                },
                error => {
                    document.getElementById('error-message').textContent = 'Erro ao obter localização. Verifique as permissões do navegador.';
                    console.error('Erro ao obter localização:', error);
                }
            );
        } else {
            document.getElementById('error-message').textContent = 'Geolocalização não é suportada pelo seu navegador.';
        }
    }

    document.getElementById('search-button').addEventListener('click', () => {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            console.log(`Cidade pesquisada: ${city}`);
            fetchWeatherDataByCity(city);
        } else {
            document.getElementById('error-message').textContent = 'Por favor, insira o nome de uma cidade.';
        }
    });

    document.getElementById('current-location-button').addEventListener('click', () => {
        getCurrentLocation();
    });
});
