import AppView from '../App';
import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

const PARTS_IN_DAY = 6;

class ImageView {
  body = document.querySelector('body');
  partOfDay = ['morning', 'day', 'evening', 'night'];
  changeImageBtn = createNode('button', 'change-image-btn');
  showAllImagesBlock = createNode('div', 'all-images');
  showAllImagesBtn = createNode('button', 'all-images__btn');
  showAllImagesText = createNode('span', 'all-images__text');
  imagesControlsWrapper = createNode('div', 'images-controls__wrapper');
  currentImagesUrls = [];
  isSliderRendered = false;
  currentImgSliderIndex = 0;
  currentOffset = 0;
  isFirstLoad = true;

  render(imagesUrl, partOfDay, { messages }) {
    this.showAllImagesText.innerText = messages.showImages;
    this.showAllImagesBtn.append(this.showAllImagesText);
    this.showAllImagesBlock.append(this.showAllImagesBtn);
    this.imagesControlsWrapper.append(this.changeImageBtn, this.showAllImagesBlock);

    AppView.getHeaderContainer().prepend(this.imagesControlsWrapper);

    this.setNewBg(imagesUrl, partOfDay);

    AppView.getHeaderContainer().classList.add('header_visible');

    this.imagesControlsClickHandler();
  }

  viewBgImage(url) {
    const img = createNode('img');
    img.src = url;
    if (!this.isFirstLoad) {
      this.changeImageBtn.disabled = true;
    }
    img.onload = () => {
      if (!this.isFirstLoad) {
        // this.changeImageBtn.disabled = true;
        this.body.classList.add('body_offset');

        setTimeout(() => {
          this.body.style.backgroundImage = `url(${url})`;
          this.body.classList.remove('body_offset');
        }, 400);

        setTimeout(() => {
          this.changeImageBtn.disabled = false;
        }, 700);
      } else {
        this.body.style.backgroundImage = `url(${url})`;
        this.isFirstLoad = false;
      }
    };
  }

  imagesControlsClickHandler = () => {
    this.imagesControlsWrapper.addEventListener('click', (e) => {
      if (e.target === this.changeImageBtn) {
        this.currentOffset += 1;
        EventEmitter.publish('getNextImage', this.currentOffset);
      }

      if (e.target.closest('.all-images__btn')) {
        EventEmitter.publish('showAllImages');
      }
    });
  }

  setNewBg(imagesUrl, partOfDay) {
    const currentHour = new Date().getHours();
    const currentImageIndex = imagesUrl[currentHour % PARTS_IN_DAY];
    this.viewBgImage(`./images/${this.partOfDay[partOfDay]}/${currentImageIndex}`);
  }

  zeroOutCurrentOffset() {
    this.currentOffset = 0;
  }

  renderImagesSlider(urls, lang) {
    this.currentImgSliderIndex = 0;

    if (urls.length) {
      this.currentImagesUrls = [...urls];
    } else {
      EventEmitter.publish('abortGettingUrls');
      return;
    }

    const popupContentWrapper = document.querySelector('.modal-popup-content__wrapper');
    const sliderWrapper = createNode('div', 'modal-popup-content__slider');

    const slideLeft = createNode('button', 'slider__slideLeft');
    slideLeft.innerText = '❮';

    const slideRight = createNode('button', 'slider__slideRight');
    slideRight.innerText = '❯';

    const imageContainer = createNode('div', 'modal-popup-content__images-container');

    const images = this.currentImagesUrls.map((url, index) => {
      return this.createSliderImage(url, index, lang);
    });

    EventEmitter.publish('hidePreloader');

    imageContainer.append(...images);
    sliderWrapper.append(imageContainer, slideLeft, slideRight);
    popupContentWrapper.append(sliderWrapper);

    this.sliderClickHandler();
  }

  sliderClickHandler = () => {
    document.querySelector('.modal-popup-content__slider').addEventListener('click', (e) => {
      const container = document.querySelector('.modal-popup-content__images-container');
      const containerWidth = container.getBoundingClientRect().width;

      if (e.target.classList.contains('slider__slideLeft')) {
        this.currentImgSliderIndex -= 1;

        if (this.currentImgSliderIndex < 0) {
          this.animationLastFirstSlides(
            container,
            e.target,
            containerWidth,
            this.currentImagesUrls.length - 1,
          );
          return;
        }

        container.style.transform = `translateX(${-(this.currentImgSliderIndex * containerWidth)}px)`;
      }

      if (e.target.classList.contains('slider__slideRight')) {
        this.currentImgSliderIndex += 1;

        if (this.currentImagesUrls.length - 1 < this.currentImgSliderIndex) {
          this.animationLastFirstSlides(container, e.target, containerWidth, 0);
          return;
        }

        container.style.transform = `translateX(${-(this.currentImgSliderIndex * containerWidth)}px)`;
      }
    });
  }

  animationLastFirstSlides(container, target, containerWidth, index) {
    const curTarget = target;
    const curContainer = container;
    setTimeout(() => {
      curContainer.style.opacity = 0;
      curTarget.disabled = true;
    }, 0);
    setTimeout(() => {
      this.currentImgSliderIndex = index;
      curContainer.style.transform = `translateX(${-(this.currentImgSliderIndex * containerWidth)}px)`;
    }, 250);
    setTimeout(() => {
      curContainer.style.opacity = 1;
    }, 350);
    setTimeout(() => {
      curTarget.disabled = false;
    }, 450);
  }

  createSliderImage(url, index, { messages }) {
    const img = createNode('img', 'slider-img__img');
    const imgItem = createNode('div', 'slider-img__item');
    const imgHours = createNode('span', 'slider-img__item-hours', 'none');
    const hoursText = `0${index}`.slice(-2);
    imgHours.innerText = `${messages.showTimeImage} ${hoursText}:00`;

    const loader = createNode('div', 'slider-img__item-loader');
    img.src = url;
    imgItem.append(loader, img, imgHours);
    img.onload = () => {
      setTimeout(() => {
        loader.classList.add('none');
      }, 10);
      img.classList.add('slider-img__item-visible');
      imgHours.classList.remove('none');
    };
    return imgItem;
  }
}

export default new ImageView();
