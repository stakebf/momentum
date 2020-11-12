import NameView from '../../Views/Name';
import LocalStorage from '../../Models/LocalStorage';

import EventEmitter from '../../Helpers/EventEmitter';

class NameController {
  init() {
    NameView.render(LocalStorage.getName(), LocalStorage.getLanguageObj());
    EventEmitter.subscribe('changeName', this.onChangeName);
  }

  onChangeName(newName) {
    LocalStorage.setName(newName);

    const errorMsg = LocalStorage.getLanguageObj();
    EventEmitter.publish('showNotification', {
      message: errorMsg.messages.newName,
      type: 'success',
    });
  }
}

export default new NameController();
