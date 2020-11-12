import AppContainer from './js/Controllers/AppContainer';
import NotificationController from './js/Controllers/Notification';
import LanguageController from './js/Controllers/Language';
import LocationController from './js/Controllers/Location';
import DateController from './js/Controllers/Date';
import NameController from './js/Controllers/Name';
import TodoController from './js/Controllers/Todo';
import ImageController from './js/Controllers/Image';
import QuoteController from './js/Controllers/Quote';
import WeatherController from './js/Controllers/Weather';
import ModalPopupController from './js/Controllers/ModalPopup';

async function initApp() {
  AppContainer.init();
  NotificationController.init();
  LanguageController.init();
  await LocationController.init();
  WeatherController.init();
  DateController.init();
  NameController.init();
  TodoController.init();
  ImageController.init();
  QuoteController.init();
  ModalPopupController.init();
}

initApp();
