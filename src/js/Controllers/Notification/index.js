import NotificationView from '../../Views/Notification';
import EventEmitter from '../../Helpers/EventEmitter';

class NotificationController {
  init() {
    EventEmitter.subscribe('showNotification', this.setNotification);
  }

  setNotification(notInfo) {
    NotificationView.show(notInfo.message, notInfo.type);
  }
}

export default new NotificationController();
