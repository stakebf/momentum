import WeatherView from '../../Views/Weather';
import LocalStorage from '../../Models/LocalStorage';
import Weather from '../../Models/Weather';
import EventEmitter from '../../Helpers/EventEmitter';

class WeatherController {
  async init() {
    const currentCoordinates = LocalStorage.getUserCityLocationInfo();

    const currentWeather = await this.getWeather({
      latitude: currentCoordinates.latitude,
      longitude: currentCoordinates.longitude,
    });

    WeatherView.render(currentWeather, LocalStorage.getLanguageObj());

    EventEmitter.subscribe('updateWeather', this.updateWeather);
  }

  updateWeather = async () => {
    const currentCoordinates = LocalStorage.getUserCityLocationInfo();
    const currentWeather = await this.getWeather({
      latitude: currentCoordinates.latitude,
      longitude: currentCoordinates.longitude,
    });

    WeatherView.updateWeatherInfo(currentWeather, LocalStorage.getLanguageObj());
  }

  async getWeather(currentCoordinates) {
    let currentWeather;

    try {
      currentWeather = await Weather.getWeather({
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
      });
    } catch (e) {
      const errorMsg = LocalStorage.getLanguageObj();
      EventEmitter.publish('showNotification', {
        message: errorMsg.messages.serviceOff,
        type: 'info',
      });

      currentWeather = {};
    }

    return currentWeather;
  }
}

export default new WeatherController();
