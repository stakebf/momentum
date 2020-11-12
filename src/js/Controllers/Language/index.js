import LanguageView from '../../Views/Language';
import LocalStorage from '../../Models/LocalStorage';
import { languagesList } from '../../Models/language';
import EventEmitter from '../../Helpers/EventEmitter';

class LanguageController {
  init() {
    if (!LocalStorage.getLanguage()) {
      LocalStorage.setLanguage('ru');
    }

    EventEmitter.subscribe('changeLanguage', this.changeLanguage);

    LanguageView.render(LocalStorage.getLanguage(), languagesList);
  }

  changeLanguage = (lang) => {
    LocalStorage.setLanguage(lang);
    LanguageView.translateApp(LocalStorage.getLanguageObj());
  };
}

export default new LanguageController();
