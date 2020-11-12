const CORS = 'https://cors-anywhere.herokuapp.com/';
const API_URL = `${CORS}https://api.forismatic.com/api/1.0/?method=getQuote&format=json`;

class Quote {
  async getQuote(lang) {
    const url = `${API_URL}&lang=${lang === 'be' ? 'ru' : lang}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}

export default new Quote();
