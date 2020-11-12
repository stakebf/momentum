const IPINFO_API_KEY = '2f650317a7a2ca';
const IPINFO_URL = 'https://ipinfo.io/';

const OPENCAGE_API_KEY = '86d9b81cab0444b9b93da035f701175f';
const OPENCAGE_URL = 'https://api.opencagedata.com/geocode/v1/';

class UserGeolocation {
  async getUserLocationIP() {
    const userGeodata = await fetch(`${IPINFO_URL}json?token=${IPINFO_API_KEY}`);
    const response = userGeodata.json();
    const data = await response;
    return data;
  }

  async getPlaceOnquery(query, language) {
    const response = await fetch(`${OPENCAGE_URL}json?q=${query}&key=${OPENCAGE_API_KEY}&language=${language}&limit=5`);
    const data = await response.json();
    return data;
  }

  async getPlaceOnCoords(coords, language) {
    const response = await fetch(`${OPENCAGE_URL}json?q=${coords.latitude},${coords.longitude}&key=${OPENCAGE_API_KEY}&language=${language}`);
    const data = await response.json();
    return data;
  }
}

export default new UserGeolocation();
