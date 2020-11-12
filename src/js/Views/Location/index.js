import AppView from '../App';
import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

class LocationView {
  locationWrapper = createNode('div', 'location__wrapper');
  locationGroup = createNode('div', 'location__group');
  locationInput = createNode('input', 'location__input');
  locationBar = createNode('span', 'location__input-placeholder');
  locationInputLabel = createNode('label', 'location__label');
  currentLocation = createNode('div', 'location__place');
  currentLocationText = createNode('span', 'location__city-text');
  currentLocationCity = createNode('span', 'location__city');

  render({ messages }, place) {
    const cityName = place.city || place.country || place.state || place.continent || place.unknown;
    this.locationInput.setAttribute('required', true);

    this.locationInputLabel.innerText = messages.locationPlaceholder;
    this.locationGroup.append(this.locationInput, this.locationBar, this.locationInputLabel);

    this.currentLocationText.innerText = messages.locationCity;
    this.currentLocationCity.innerText = cityName;

    this.currentLocation.append(this.currentLocationText, this.currentLocationCity);
    this.locationWrapper.append(this.locationGroup, this.currentLocation);

    AppView.getHeaderContainer().append(this.locationWrapper);

    this.cityInputKeydownHandler();
  }

  cityInputKeydownHandler = () => {
    this.locationInput.addEventListener('keydown', this.changeName);
  }

  changeName = (e) => {
    if (e.type === 'keydown') {
      if (e.keyCode === 13 || e.which === 13) {
        if (this.locationInput.value.trim()) {
          EventEmitter.publish('changeCity', this.locationInput.value);
          this.locationInput.value = '';
        }
      }
    }
  }

  showCitiesOptions(citiesList, { messages }) {
    const popupContentWrapper = document.querySelector('.modal-popup-content__wrapper');
    const cityTitle = createNode('p', 'cities__title');
    cityTitle.innerText = messages.relevantCity;

    const citiesListWrapper = createNode('ul', 'cities__list');
    const cityItems = citiesList.map((item, index) => {
      const city = item.city ? `${item.city},` : '';
      const state = item.state ? `${item.state},` : '';
      const country = item.country ? `${item.country},` : '';
      const continent = item.continent ? `${item.continent},` : '';
      // eslint-disable-next-line no-underscore-dangle
      const type = `${messages.relevantCityType}: ${item._type}`;

      const cityItem = createNode('li', 'cities__list-item');
      cityItem.dataset.cityIndex = index;

      const itemContent = `${city} ${state} ${country} ${continent} ${type}`;
      cityItem.innerText = itemContent;

      setTimeout(() => {
        cityItem.classList.add('visibleCity');
      }, 100 * (index + 1));

      return cityItem;
    });

    citiesListWrapper.append(...cityItems);
    popupContentWrapper.append(cityTitle, citiesListWrapper);

    this.cityClickHandler();
  }

  cityClickHandler = () => {
    document.querySelector('.cities__list').addEventListener('click', (e) => {
      if (e.target.classList.contains('cities__list-item')) {
        EventEmitter.publish('setNewCity', e.target.dataset.cityIndex);
        EventEmitter.publish('removePopup');
      }
    });
  }

  setNewCityName(cityName) {
    this.currentLocationCity.innerText = cityName;
  }
}

export default new LocationView();
