const API_KEY = 'c11ea9d8ff234d5f474b292bf66f5968';
const OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/';

class Weather {
  async getWeather(location) {
    const response = await fetch(`${OPENWEATHERMAP_URL}forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}&lang=ru`);
    const data = await response.json();
    return data;
  }
}

export default new Weather();
