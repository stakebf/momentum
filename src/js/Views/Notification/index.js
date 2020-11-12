import createNode from '../../Helpers/createNode';

class NotificationView {
  show(msg, type) {
    const notification = createNode('div', 'notification', 'notification-hidden');
    notification.setAttribute('data-type', type);
    notification.innerText = msg;

    document.querySelector('body').append(notification);

    setTimeout(() => {
      notification.classList.add('notification-visible');
    }, 50);

    setTimeout(() => {
      notification.classList.remove('notification-visible');
    }, 4000);

    setTimeout(() => {
      notification.remove();
    }, 4500);
  }
}

export default new NotificationView();
