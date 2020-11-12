import createNode from '../../Helpers/createNode';

class AppView {
  appWrapper = createNode('div', 'app');
  appContainer = createNode('div', 'app__wrapper');
  headerContainer = createNode('div', 'header');

  render() {
    this.appWrapper.append(this.appContainer);
    this.appContainer.append(this.headerContainer);
    document.querySelector('body').append(this.appWrapper);
  }

  getContainer() {
    return this.appContainer;
  }

  getHeaderContainer() {
    return this.headerContainer;
  }
}

export default new AppView();
