import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

class NameView {
  userName = '';
  hasInput = false;
  usernameBlockWrapper = createNode('div', 'username__wrapper');
  usernameBlock = createNode('span', 'username');
  newUserNameInput = createNode('input', 'username__new-name');
  newUserNameBtnSave = createNode('button', 'username__save-name');

  render(userName, lang) {
    this.newUserNameInput.setAttribute('type', 'text');
    this.newUserNameInput.setAttribute('placeholder', lang.messages.userNameInput);

    this.userName = userName || lang.messages.userNameInput;
    this.usernameBlock.innerText = this.userName;

    this.usernameBlockWrapper.append(this.usernameBlock);

    document.querySelector('.greeting__user').append(this.usernameBlockWrapper);
    this.usernameClickHandler();
  }

  usernameClickHandler = () => {
    this.usernameBlockWrapper.addEventListener('click', (e) => {
      if (!this.hasInput) {
        this.hasInput = true;

        this.usernameBlockWrapper.append(this.newUserNameInput, this.newUserNameBtnSave);
        this.usernameBlock.classList.add('name_hidden');

        this.newUserNameInput.focus();

        this.newUserNameChangeHandler();
        this.newUserNameKeydownHandler();
      }

      if (e.target.classList.contains('username__save-name')) {
        this.saveName();
      }
    });
  }

  newUserNameChangeHandler = () => {
    this.newUserNameInput.addEventListener('input', this.changeName);
  }

  removeChangeHandler = () => {
    this.newUserNameInput.removeEventListener('input', this.changeName);
  }

  newUserNameKeydownHandler = () => {
    this.newUserNameInput.addEventListener('keydown', this.changeName);
  }

  removeKeydownHandler = () => {
    this.newUserNameInput.removeEventListener('keydown', this.changeName);
  }

  changeName = (e) => {
    if (e.target.value.trim()) {
      this.newUserNameBtnSave.style.background = 'green';
    } else {
      this.newUserNameBtnSave.style.background = 'red';
    }

    if (e.type === 'keydown') {
      if (e.keyCode === 13 || e.which === 13) {
        this.saveName();
      }
    }
  }

  saveName() {
    if (this.newUserNameInput.value.trim()) {
      const { value } = this.newUserNameInput;

      this.usernameBlock.innerText = value;
      this.userName = value;

      EventEmitter.publish('changeName', value);
    }

    this.hasInput = false;

    this.removeChangeHandler();
    this.removeKeydownHandler();

    this.usernameBlock.innerText = this.userName;
    this.usernameBlock.classList.remove('name_hidden');

    this.newUserNameInput.value = '';
    this.newUserNameInput.remove();

    this.newUserNameBtnSave.remove();
  }
}

export default new NameView();
