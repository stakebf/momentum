import * as language from '../language';

class LocalStorage {
  setLocation(lat, lon) {
    localStorage.setItem('location', JSON.stringify({
      latitude: lat,
      longitude: lon,
    }));
  }

  getLocationCoordinates() {
    return JSON.parse(localStorage.getItem('location'));
  }

  setUserCityLocationInfo(cityInfo) {
    localStorage.setItem('userCityInfo', JSON.stringify(cityInfo));
  }

  getUserCityLocationInfo() {
    return JSON.parse(localStorage.getItem('userCityInfo'));
  }

  setLanguage(lang) {
    localStorage.setItem('language', lang);
  }

  getLanguage() {
    return localStorage.getItem('language');
  }

  getLanguageObj() {
    return language[this.getLanguage()];
  }

  setName(name) {
    localStorage.setItem('name', name);
  }

  getName() {
    return localStorage.getItem('name');
  }

  setIndex(index) {
    localStorage.setItem('index', index);
  }

  getIndex() {
    return localStorage.getItem('index');
  }

  increaseIndex() {
    const newIndex = parseInt(this.getIndex(), 10) + 1;
    this.setIndex(newIndex);
    return newIndex;
  }

  setTodo(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  getTodoList() {
    return JSON.parse(localStorage.getItem('todos'));
  }

  setDate(date) {
    localStorage.setItem('date', date);
  }

  getDate() {
    return localStorage.getItem('date');
  }

  setImagesList(imagesList) {
    localStorage.setItem('images', JSON.stringify(imagesList));
  }

  getImagesList() {
    return JSON.parse(localStorage.getItem('images'));
  }

  setQuoteInFavList(quote) {
    localStorage.setItem('quotes', JSON.stringify(quote));
  }

  getFavQuotesList() {
    return JSON.parse(localStorage.getItem('quotes'));
  }
}

export default new LocalStorage();
