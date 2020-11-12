import DateController from '../Date';
import ImageView from '../../Views/Image';
import LocalStorage from '../../Models/LocalStorage';
import EventEmitter from '../../Helpers/EventEmitter';

const MIN_IMG_NUMBER = 1;
const MAX_IMG_NUMBER = 20;
const QUANTITY_IMG_PER_PIECE = 6;
const PARTS_IN_DAY = 6;

class ImageController {
  init() {
    if (!LocalStorage.getImagesList()) {
      this.setRandomImages();
    }
    EventEmitter.subscribe('changeImagesList', this.changeImagesList);
    EventEmitter.subscribe('getNextImage', this.getNextImage);
    EventEmitter.subscribe('showAllImages', this.showAllImages);
    EventEmitter.subscribe('abortGettingUrls', this.abortGettingUrls);

    ImageView.render(
      this.getImagesUrls(),
      DateController.getPartOfDay(new Date().getHours()),
      LocalStorage.getLanguageObj(),
    );
  }

  setRandomImages() {
    LocalStorage.setImagesList(this.createRandomImageList());
  }

  createRandomImageList() {
    let randomList = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const randomNumber = Math.floor(
        Math.random() * (MAX_IMG_NUMBER - MIN_IMG_NUMBER + 1),
      ) + MIN_IMG_NUMBER;

      randomList = [...new Set([...randomList, randomNumber])];

      if (randomList.length === QUANTITY_IMG_PER_PIECE) {
        break;
      }
    }

    return randomList;
  }

  changeImagesList = () => {
    this.setRandomImages();
    this.getNextImage(0);
    ImageView.zeroOutCurrentOffset();
  }

  getImagesUrls() {
    const images = LocalStorage.getImagesList().map((item) => {
      const number = `0${item}`.slice(-2);
      return `${number}.jpg`;
    });

    return images;
  }

  getNextImage = (offset) => {
    const currentHour = new Date().getHours();
    const hoursWithOffset = currentHour + offset;
    const hours = hoursWithOffset > 23 ? hoursWithOffset % 24 : hoursWithOffset;
    const currentImageIndex = this.getImagesUrls()[hours % PARTS_IN_DAY];
    const partOfDay = DateController.getPartOfDay(hours);
    const url = `./images/${['morning', 'day', 'evening', 'night'][partOfDay]}/${currentImageIndex}`;
    ImageView.viewBgImage(url);
  }

  showAllImages = () => {
    EventEmitter.publish('showPopup');
    ImageView.renderImagesSlider(this.getAllCurrentUrls(), LocalStorage.getLanguageObj());
  }

  getAllCurrentUrls = () => {
    const imagesNames = this.getImagesUrls();
    const urls = Array.from({ length: 24 }, (item, index) => {
      const partOfDay = DateController.getPartOfDay(index);
      const currentImageIndex = imagesNames[index % PARTS_IN_DAY];
      return `./images/${['morning', 'day', 'evening', 'night'][partOfDay]}/${currentImageIndex}`;
    });
    return urls;
  }

  abortGettingUrls() {
    const errorMsg = LocalStorage.getLanguageObj();
    EventEmitter.publish('showNotification', {
      message: errorMsg.messages.wrongImageUrls,
      type: 'info',
    });
  }
}

export default new ImageController();
