import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

class ModalPopupView {
  render() {
    const modalPopup = createNode('div', 'modal-popup');
    const modalPopupContentWrapper = createNode('div', 'modal-popup-content__wrapper');
    const preloader = createNode('div', 'loader');
    const btnClose = createNode('button', 'close-popup');

    modalPopupContentWrapper.append(btnClose, preloader);
    modalPopup.append(modalPopupContentWrapper);
    document.body.append(modalPopup);

    setTimeout(() => {
      modalPopup.style.transform = 'scale(1)';
      modalPopup.style.opacity = 1;
    }, 100);

    this.popupClickHandler();
    EventEmitter.subscribe('removePopup', this.removePopup);
  }

  hidePreloader() {
    document.querySelector('.modal-popup-content__wrapper .loader').classList.add('none');
  }

  showPreloader() {
    document.querySelector('.modal-popup-content__wrapper .loader').classList.remove('none');
  }

  popupClickHandler = () => {
    document.querySelector('.modal-popup').addEventListener('click', (e) => {
      if (e.target.classList.contains('close-popup')) {
        this.removePopup();
      }
    });
  }

  removePopup() {
    const popup = document.querySelector('.modal-popup');

    setTimeout(() => {
      popup.style.transform = 'scale(0)';
      popup.style.opacity = 0;
    }, 100);

    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

export default new ModalPopupView();
