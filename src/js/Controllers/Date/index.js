import LocalStorage from '../../Models/LocalStorage';
import DateView from '../../Views/Date';
import ImageView from '../../Views/Image';
import EventEmitter from '../../Helpers/EventEmitter';

function addZeroHelper(time) {
  return `0${time}`.slice(-2);
}

function getHourHelper(lang, hour) {
  return lang === 'en' ? (hour % 12 || 12) : hour;
}

class DateController {
  init() {
    const currentDate = new Date();

    if (!LocalStorage.getDate()) {
      LocalStorage.setDate(currentDate.getDate());
    }

    DateView.render(
      LocalStorage.getLanguageObj(),
      this.getPartOfDay(currentDate.getHours()),
    );

    this.onTimerChange();

    setInterval(() => this.onTimerChange(), 1000);

    EventEmitter.subscribe('updateGreeting', this.updateGreeting);
  }

  onTimerChange() {
    const currentDate = new Date();
    const lang = LocalStorage.getLanguage();

    this.updateImagesList(currentDate.getDate());

    let amPm = '';
    let hours = currentDate.getHours();

    if (lang === 'en') {
      amPm = hours >= 12 ? 'PM' : 'AM';
    }

    const minutes = addZeroHelper(currentDate.getMinutes());
    const seconds = addZeroHelper(currentDate.getSeconds());

    if (this.shouldUpdateGreeting(hours, parseInt(minutes, 10), parseInt(seconds, 10))) {
      DateView.setGreetingInfo(LocalStorage.getLanguageObj(), this.getPartOfDay(hours));
    }

    this.changeImageEveryHour(hours, parseInt(minutes, 10), parseInt(seconds, 10));

    hours = addZeroHelper(getHourHelper(lang, hours));

    DateView.updateTime(`${hours}:${minutes}:${seconds} ${amPm}`);
  }

  shouldUpdateGreeting(hours, minutes, seconds) {
    return !(hours % 6) && !minutes && !seconds;
  }

  updateGreeting = () => {
    const hours = new Date().getHours();
    DateView.setGreetingInfo(LocalStorage.getLanguageObj(), this.getPartOfDay(hours));
  }

  updateImagesList(date) {
    if (parseInt(LocalStorage.getDate(), 10) !== date) {
      LocalStorage.setDate(date);
      EventEmitter.publish('changeImagesList');
    }
  }

  getPartOfDay(hours) {
    let partOfDay;
    switch (true) {
      case (hours >= 6 && hours < 12):
        partOfDay = 0;
        break;
      case (hours >= 12 && hours < 18):
        partOfDay = 1;
        break;
      case (hours >= 18 && hours < 24):
        partOfDay = 2;
        break;
      case (hours >= 0 && hours < 6):
        partOfDay = 3;
        break;
      default:
    }
    return partOfDay;
  }

  changeImageEveryHour(hour, minutes, seconds) {
    if ((hour && !minutes && !seconds)
    || (hour === 0 && !minutes && !seconds)) {
      EventEmitter.publish('getNextImage', 0);
      EventEmitter.publish('updateWeather');
      ImageView.zeroOutCurrentOffset();
    }
  }
}

export default new DateController();
