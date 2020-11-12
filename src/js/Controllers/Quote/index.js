import QuoteView from '../../Views/Quote';
import Quote from '../../Models/Quote';
import LocalStorage from '../../Models/LocalStorage';
import EventEmitter from '../../Helpers/EventEmitter';

const DELAY = 0;

class QuoteController {
  currentQuote = {};

  async init() {
    QuoteView.renderWrapper();

    const newQuote = await this.getNewQuote();
    const quotes = LocalStorage.getFavQuotesList();

    QuoteView.render(quotes, newQuote, LocalStorage.getLanguageObj());
    EventEmitter.subscribe('setNewQuote', this.setNewQuote);
    EventEmitter.subscribe('oNaddToFavourite', this.addToFavouriteQuotes);
    EventEmitter.subscribe('oNremoveFavQuote', this.removeFavQuote);
  }

  async getNewQuote() {
    let newQuote;

    try {
      newQuote = { ...await Quote.getQuote(LocalStorage.getLanguage()) };
      this.currentQuote = { ...newQuote };
    } catch (e) {
      const errorMsg = LocalStorage.getLanguageObj();
      EventEmitter.publish('showNotification', {
        message: errorMsg.messages.serviceOff,
        type: 'info',
      });
    }

    return newQuote || {};
  }

  setNewQuote = async () => {
    const newQuote = await this.getNewQuote();
    QuoteView.changeQuote(newQuote, LocalStorage.getLanguageObj());
  }

  addToFavouriteQuotes = () => {
    let newQuotesList = [];
    const newQuote = {
      quoteText: this.currentQuote.quoteText,
      quoteAuthor: this.currentQuote.quoteAuthor,
      index: LocalStorage.increaseIndex(),
    };

    if (LocalStorage.getFavQuotesList()) {
      newQuotesList = [...LocalStorage.getFavQuotesList(), newQuote];
    } else {
      newQuotesList = [newQuote];
    }

    LocalStorage.setQuoteInFavList(newQuotesList);
    QuoteView.renderSingleQuote(LocalStorage.getLanguageObj(), newQuote, DELAY);
  }

  removeFavQuote(index) {
    const newQuotesList = LocalStorage.getFavQuotesList().filter(
      (item) => item.index !== parseInt(index, 10),
    );

    LocalStorage.setQuoteInFavList(newQuotesList);
  }
}

export default new QuoteController();
