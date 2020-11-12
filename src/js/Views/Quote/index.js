import AppView from '../App';
import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

class QuoteView {
  quoteWrapper = createNode('div', 'quote__wrapper');
  quote = createNode('div', 'quote');
  quoteContent = createNode('p', 'quote__content');
  quoteAuthor = createNode('p', 'quote__author');
  quoteControls = createNode('div', 'quote__controls');
  refreshQuoteBtn = createNode('button', 'refresh-quote-btn');
  addToFavouriteQuoteBtn = createNode('button', 'favourite-quote-btn');
  favouriteQuotes = createNode('ul', 'favourite-quotes');
  preloader = createNode('div', 'loader');

  renderWrapper() {
    this.quoteWrapper.append(this.preloader, this.favouriteQuotes);

    setTimeout(() => {
      this.quoteWrapper.classList.add('quote__wrapper_visible');
    }, 700);

    AppView.getContainer().append(this.quoteWrapper);
  }

  render(quotes, newQuote, { messages }) {
    this.preloader.remove();
    this.addToFavouriteQuoteBtn.innerText = messages.addToFavouriteQuote;

    if (Object.keys(newQuote).length) {
      const { quoteText, quoteAuthor } = newQuote;
      this.quoteContent.innerText = quoteText;
      this.quoteAuthor.innerText = !quoteAuthor ? `— ${messages.unknownQuoteAuthor}` : `— ${quoteAuthor}`;
    } else {
      this.quoteContent.innerText = messages.loadQuoteError;
      this.addToFavouriteQuoteBtn.disabled = true;
    }

    this.quoteControls.append(this.refreshQuoteBtn, this.addToFavouriteQuoteBtn);
    this.quote.append(this.quoteControls, this.quoteContent, this.quoteAuthor);
    this.quoteWrapper.prepend(this.quote);

    this.favouriteQuotes.append(...this.renderFavouriteQuotes(messages, quotes));

    this.quotesBtnsClickHandler();
  }

  quotesBtnsClickHandler = () => {
    this.quoteWrapper.addEventListener('click', (e) => {
      if (e.target === this.refreshQuoteBtn) {
        this.refreshQuoteBtn.disabled = true;
        EventEmitter.publish('setNewQuote');
      }

      if (e.target === this.addToFavouriteQuoteBtn) {
        EventEmitter.publish('oNaddToFavourite');
        this.addToFavouriteQuoteBtn.disabled = true;
      }

      if (e.target.classList.contains('favourite-quotes__delete')) {
        const favQuote = e.target.closest('.favourite-quotes__item');

        EventEmitter.publish('oNremoveFavQuote', favQuote.dataset.index);

        favQuote.classList.remove('visible');

        setTimeout(() => {
          favQuote.remove();
        }, 150);
      }
    });
  }

  changeQuote(quote, { messages }) {
    if (!Object.keys(quote).length) {
      this.refreshQuoteBtn.disabled = false;
      return;
    }

    setTimeout(() => {
      this.quoteContent.classList.toggle('hidden');
      this.quoteAuthor.classList.toggle('hidden');
    }, 10);

    setTimeout(() => {
      const { quoteText, quoteAuthor } = quote;
      this.quoteContent.innerText = quoteText;
      this.quoteAuthor.innerText = !quoteAuthor ? `— ${messages.unknownQuoteAuthor}` : `— ${quoteAuthor}`;
    }, 150);

    setTimeout(() => {
      this.quoteContent.classList.toggle('hidden');
      this.quoteAuthor.classList.toggle('hidden');
      this.refreshQuoteBtn.disabled = false;
      this.addToFavouriteQuoteBtn.disabled = false;
    }, 350);
  }

  renderFavouriteQuotes(lang, qoutes) {
    if (qoutes && qoutes.length) {
      return qoutes.map((quote, index) => {
        return this.createFavouriteQuote(lang, quote, index);
      });
    }
    return '';
  }

  createFavouriteQuote(messages, { quoteAuthor, quoteText, index }, delay) {
    const quoteItem = createNode('li', 'favourite-quotes__item');
    quoteItem.dataset.index = index;

    const deleteBtn = createNode('button', 'favourite-quotes__delete');
    deleteBtn.innerText = 'X';

    const favQuoteContentWrapper = createNode('div', 'favourite-quotes__content-wrapper');

    const favQuoteContent = createNode('p', 'favourite-quotes__content');
    favQuoteContent.innerText = quoteText;

    const favQuoteAuthor = createNode('p', 'favourite-quotes__author');

    if (!quoteAuthor) {
      favQuoteAuthor.innerText = `— ${messages.unknownQuoteAuthor}`;
      favQuoteAuthor.dataset.author = 'unknown';
    } else {
      favQuoteAuthor.innerText = `— ${quoteAuthor}`;
    }

    setTimeout(() => {
      quoteItem.classList.add('visible');
    }, (delay + 0.5) * 100);

    quoteItem.setAttribute('data-index', index);
    favQuoteContentWrapper.append(favQuoteContent, favQuoteAuthor);
    quoteItem.append(deleteBtn, favQuoteContentWrapper);

    return quoteItem;
  }

  renderSingleQuote({ messages }, quote, delay) {
    this.favouriteQuotes.append(this.createFavouriteQuote(messages, quote, delay));
  }
}

export default new QuoteView();
