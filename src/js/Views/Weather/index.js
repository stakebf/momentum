import AppView from '../App';
import createNode from '../../Helpers/createNode';
// import EventEmitter from '../../Helpers/EventEmitter';

class WeatherView {
  weatherWrapper = createNode('div', 'weather');
  weatherParameters = createNode('div', 'weather-parameter__wrapper');
  weatherTemperature = createNode('span', 'weather__temperature');

  weatherStatusWrapper = createNode('div', 'weather__status-wrapper');
  weatherStatus = createNode('span', 'weather__status');

  weatherWindWrapper = createNode('div', 'weather__wind');
  weatherWindText = createNode('span', 'weather__wind-text');
  weatherWind = createNode('span', 'weather__wind-data');
  weatherWindTextMs = createNode('span', 'weather__wind-text-ms');

  weatherHumidityWrapper = createNode('div', 'weather__humidity');
  weatherHumidityText = createNode('span', 'weather__humidity-text');
  weatherHumidity = createNode('span', 'weather__humidity-data');

  weatherIcon = createNode('div', 'weather__icon');

  render(weather, lang) {
    this.updateWeatherInfo(weather, lang);

    this.weatherStatusWrapper.append(this.weatherStatus);

    this.weatherWindWrapper.append(this.weatherWindText, this.weatherWind, this.weatherWindTextMs);

    this.weatherHumidityWrapper.append(this.weatherHumidityText, this.weatherHumidity);

    this.weatherParameters.append(
      this.weatherTemperature,
      this.weatherStatusWrapper,
      this.weatherWindWrapper,
      this.weatherHumidityWrapper,
    );

    this.weatherWrapper.append(this.weatherParameters, this.weatherIcon);
    AppView.getHeaderContainer().append(this.weatherWrapper);
  }

  updateWeatherInfo(weather, { messages }) {
    if (Object.keys(weather).length) {
      const weatherConditionID = weather.list[0].weather[0].id;
      this.weatherStatus.dataset.weatherCondition = weatherConditionID;
      this.weatherStatus.innerText = `${messages.weather[weatherConditionID]}`;

      this.weatherTemperature.innerHTML = Math.round(weather.list[0].main.temp);

      this.weatherWindText.innerHTML = messages.wind;
      this.weatherWind.innerHTML = Math.round(weather.list[0].wind.speed);
      this.weatherWindTextMs.innerHTML = messages.ms;

      this.weatherHumidityText.innerHTML = messages.humidity;
      this.weatherHumidity.innerHTML = `${weather.list[0].main.humidity}%`;

      this.weatherIcon.innerHTML = '';
      this.weatherIcon.append(this.getSvgIcon(weatherConditionID));
    }
  }

  getSvgIcon(weatherCondition) {
    let path;
    switch (true) {
      case (weatherCondition >= 200 && weatherCondition <= 233):
        path = './images/weather/thunderstorm.svg';
        break;
      case (weatherCondition >= 300 && weatherCondition <= 502):
      case (weatherCondition >= 520 && weatherCondition <= 522):
        path = './images/weather/rain.svg';
        break;
      case (weatherCondition === 511):
      case (weatherCondition >= 610 && weatherCondition <= 612):
        path = './images/weather/sleet.svg';
        break;
      case (weatherCondition >= 600 && weatherCondition <= 609):
      case (weatherCondition >= 621 && weatherCondition <= 623):
        path = './images/weather/snow.svg';
        break;
      case (weatherCondition >= 700 && weatherCondition <= 751):
        path = './images/weather/windy.svg';
        break;
      case (weatherCondition === 800):
        path = './images/weather/sunny.svg';
        break;
      case (weatherCondition === 801 || weatherCondition === 803):
        path = './images/weather/partly-cloudy.svg';
        break;
      case (weatherCondition === 802 || weatherCondition === 804):
        path = './images/weather/few-clouds.svg';
        break;
      case (weatherCondition === 900):
        path = './images/weather/tornado.svg';
        break;
      default:
        path = './images/default-status.png';
    }

    const svgObj = createNode('object');
    svgObj.setAttribute('type', 'image/svg+xml');
    svgObj.setAttribute('data', path);
    svgObj.innerText = 'Ваш браузер не поддерживает SVG';

    return svgObj;
  }
}

export default new WeatherView();
