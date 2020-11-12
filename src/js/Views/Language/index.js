import EventEmitter from '../../Helpers/EventEmitter';
import createNode from '../../Helpers/createNode';
import AppView from '../App';

const MARKER_OFFSET = 4;

class LanguageView {
  btnsWrapper = createNode('div', 'btns-lang__wrapper');
  marker = createNode('div', 'btn-lng_marker');
  languageBtns = {};

  render(lang, { languages }) {
    const languagesBtns = languages.map((language) => {
      const button = createNode('button', 'btn-lng');
      button.innerText = language;
      button.setAttribute('data-lang', language);
      this.languageBtns[language] = button;
      return button;
    });

    this.setBtnActive(lang);

    this.btnsWrapper.append(...languagesBtns, this.marker);

    AppView.getHeaderContainer().append(this.btnsWrapper);

    this.displaceMarker();

    this.languageBtnClickHandler();
  }

  setBtnActive(lang) {
    this.languageBtns[lang].classList.add('btn-lng_active');
  }

  languageBtnClickHandler = () => {
    this.btnsWrapper.addEventListener('click', (e) => {
      const isLanguageButton = e.target.classList.contains('btn-lng');
      const isActiveLanguageButton = e.target.classList.contains('btn-lng_active');

      if (isLanguageButton && !isActiveLanguageButton) {
        [...this.btnsWrapper.children].forEach((el) => {
          el.classList.remove('btn-lng_active');
          if (el === e.target) {
            e.target.classList.add('btn-lng_active');
            this.animateBtn(e.target);
            EventEmitter.publish('changeLanguage', e.target.dataset.lang);
          }
        });
      }
    });
  };

  animateBtn(target) {
    this.marker.style.left = `${target.offsetLeft - MARKER_OFFSET}px`;
  }

  displaceMarker() {
    const activeBtn = document.querySelector('.btn-lng_active');
    this.marker.style.left = `${activeBtn.offsetLeft - MARKER_OFFSET}px`;

    setTimeout(() => {
      this.marker.style.opacity = 1;
    }, 200);
  }

  translateApp({ messages }) {
    this.translateBtnAllImagesTitle(messages);
    this.translateLocation(messages);
    this.translateWeather(messages);

    EventEmitter.publish('updateGreeting');

    this.translateTodoComponent(messages);
    this.translateQuoteComponent(messages);
    this.translateUserNameInput(messages);
  }

  translateBtnAllImagesTitle(messages) {
    const btnAllImagesTitle = document.querySelector('.all-images__text');
    btnAllImagesTitle.innerText = messages.showImages;
  }

  translateLocation(messages) {
    const locationInputLabel = document.querySelector('.location__label');
    locationInputLabel.innerText = messages.locationPlaceholder;

    const locationCityTitle = document.querySelector('.location__city-text');
    locationCityTitle.innerText = messages.locationCity;
  }

  translateWeather(messages) {
    const weatherWind = document.querySelector('.weather__wind-text');
    const weatherMs = document.querySelector('.weather__wind-text-ms');
    const weatherHumidity = document.querySelector('.weather__humidity-text');
    const weatherCondition = document.querySelector('.weather__status');

    if (weatherWind && weatherMs && weatherHumidity) {
      weatherWind.innerText = messages.wind;
      weatherMs.innerText = messages.ms;
      weatherHumidity.innerText = messages.humidity;
      const condition = weatherCondition.dataset.weatherCondition;
      weatherCondition.innerText = messages.weather[condition];
    }
  }

  translateTodoComponent(messages) {
    const todoInputAdd = document.querySelector('.todo__input-add');
    todoInputAdd.setAttribute('placeholder', messages.addTodoInput);

    const todoInputBtn = document.querySelector('.todo__btn-add');
    todoInputBtn.innerText = messages.addTodoBtn;

    const todoList = document.querySelector('.todo__list');
    if (!todoList.children.length) {
      todoList.innerText = messages.emptyTodo;
    } else {
      [...todoList.children].forEach((item) => {
        [...item.children[0].children].forEach((btn) => {
          const button = btn;
          if (btn.classList.contains('todo__item-done')) {
            button.innerText = messages.markAsDoneTodo;
          }

          if (btn.classList.contains('todo__item-important')) {
            button.innerText = messages.markAsImportantTodo;
          }

          if (btn.classList.contains('todo__item-delete')) {
            button.innerText = messages.deleteTodoItem;
          }
        });
      });
    }
  }

  translateQuoteComponent(messages) {
    const quoteFavBtn = document.querySelector('.favourite-quote-btn');
    if (quoteFavBtn) {
      quoteFavBtn.innerText = messages.addToFavouriteQuote;
    }
  }

  translateUserNameInput(messages) {
    const userNameInput = document.querySelector('.username__new-name');
    if (userNameInput) {
      userNameInput.setAttribute('placeholder', messages.userNameInput);
    }
  }
}

export default new LanguageView();
