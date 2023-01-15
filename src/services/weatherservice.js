const API_KEY = "d9efa80a63c282121825217f5de8090f";
const Base_URL = "https://api.openweathermap.org/data/2.5"

const getWeatherData = (infoType, searchParam) => {
    const url = new URL(Base_URL + '/' + infoType);
    url.search = new URLSearchParams({...searchParam, appid:API_KEY})

    return fetch(url)
        .then((res) => res.json())
        .then((data) => data);
};

export default getWeatherData;

