import EventEmitter from '../../Helpers/EventEmitter';
import ModalPopupView from '../../Views/ModalPopup';

class ModalPopupController {
  init() {
    EventEmitter.subscribe('showPopup', this.showPopup);
    EventEmitter.subscribe('hidePreloader', this.hidePreloader);
    EventEmitter.subscribe('showPreloader', this.showPreloader);
  }

  showPopup() {
    ModalPopupView.render();
  }

  hidePreloader() {
    ModalPopupView.hidePreloader();
  }

  showPreloader() {
    ModalPopupView.hidePreloader();
  }
}

export default new ModalPopupController();
