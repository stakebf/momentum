import UserGeolocation from '../../Models/Location';
import LocalStorage from '../../Models/LocalStorage';
import LocationView from '../../Views/Location';
import EventEmitter from '../../Helpers/EventEmitter';

import ModalPopupController from '../ModalPopup';

const DEFAULT_LOCATION = {
  latitude: 53.902334,
  longitude: 27.5618791,
};

class LocationController {
  citiesList = [];

  // eslint-disable-next-line consistent-return
  init() {
    EventEmitter.subscribe('changeCity', this.changeCity);
    EventEmitter.subscribe('setNewCity', this.setNewCity);

    if (!LocalStorage.getLocationCoordinates()) {
      return this.getCurrentPosition()
        .then(this.getCurrentPositionSuccess)
        .catch(this.getCurrentPositionError)
        .then(async (coords) => {
          const info = await UserGeolocation.getPlaceOnCoords(coords, LocalStorage.getLanguage());
          let cityInfo;

          if (info.results.length) {
            cityInfo = {
              ...info.results[0].components,
              latitude: info.results[0].geometry.lat,
              longitude: info.results[0].geometry.lng,
            };
            LocalStorage.setUserCityLocationInfo(cityInfo);
          } else {
            cityInfo = {
              ...DEFAULT_LOCATION,
              city: 'Минск',
              default: 'defaultLocation',
            };

            const errorMsg = LocalStorage.getLanguageObj();

            EventEmitter.publish('showNotification', {
              message: errorMsg.messages.defaultCity,
              type: 'info',
            });

            LocalStorage.setUserCityLocationInfo(cityInfo);
          }

          LocationView.render(LocalStorage.getLanguageObj(), cityInfo);
        });
    }

    LocationView.render(
      LocalStorage.getLanguageObj(),
      LocalStorage.getUserCityLocationInfo(),
    );
  }

  getCurrentPosition = (options) => {
    const currentPosition = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
    return currentPosition;
  };

  getCurrentPositionSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    LocalStorage.setLocation(latitude, longitude);

    return {
      latitude,
      longitude,
    };
  };

  getCurrentPositionError = async () => {
    let coordinates;

    try {
      const userGetLocation = await UserGeolocation.getUserLocationIP();
      const coords = userGetLocation.loc.split(',');

      LocalStorage.setLocation(coords[0], coords[1]);

      coordinates = {
        latitude: coords[0],
        longitude: coords[1],
      };
    } catch (error) {
      const errorMsg = LocalStorage.getLanguageObj();

      EventEmitter.publish('showNotification', {
        message: errorMsg.messages.defaultCity,
        type: 'info',
      });

      LocalStorage.setLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);

      coordinates = {
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
      };
    }

    return coordinates;
  };

  getPlace = async () => {
    const lang = LocalStorage.getLanguage();
    const coords = LocalStorage.getLocationCoordinates();
    const place = await UserGeolocation.getPlaceOnCoords(coords, lang);
    return place;
  };

  changeCity = async (cityName) => {
    let cities;

    try {
      cities = await UserGeolocation.getPlaceOnquery(
        cityName,
        LocalStorage.getLanguageObj(),
      );
    } catch (e) {
      const errorMsg = LocalStorage.getLanguageObj();
      EventEmitter.publish('showNotification', {
        message: errorMsg.messages.serviceOff,
        type: 'info',
      });

      return;
    }

    if (cities && cities.results.length) {
      this.citiesList = cities.results.map(({ components, geometry }) => {
        return {
          ...components,
          ...geometry,
        };
      });
    } else {
      const errorMsg = LocalStorage.getLanguageObj();
      EventEmitter.publish('showNotification', {
        message: errorMsg.messages.error,
        type: 'error',
      });
      return;
    }

    EventEmitter.publish('showPopup');
    ModalPopupController.hidePreloader();
    LocationView.showCitiesOptions(this.citiesList, LocalStorage.getLanguageObj());
  }

  setNewCity = (cityIndex) => {
    const cityName = this.citiesList[cityIndex].city
      || this.citiesList[cityIndex].state
      || this.citiesList[cityIndex].country
      || this.citiesList[cityIndex].continent
      || this.citiesList[cityIndex].unknown;
    LocationView.setNewCityName(cityName);

    const city = {
      ...this.citiesList[cityIndex],
      latitude: this.citiesList[cityIndex].lat,
      longitude: this.citiesList[cityIndex].lng,
    };

    LocalStorage.setUserCityLocationInfo(city);
    EventEmitter.publish('updateWeather');
  }
}

export default new LocationController();
