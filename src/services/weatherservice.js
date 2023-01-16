const API_KEY = "d9efa80a63c282121825217f5de8090f";
const Base_URL = "https://api.openweathermap.org/data/2.5"

const getWeatherData = (infoType, searchParam) => {
    const url = new URL(Base_URL + '/' + infoType);
    url.search = new URLSearchParams({...searchParam, appid:API_KEY})

    return fetch(url)
        .then((res) => res.json())
};

const formatCurrentWeather = (data) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data

    const {main: details, icon} = weather[0]

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, speed, icon}
}

const formatForecastWeather = (data) => {
    let { timezone, daily, hourly} = data;
    daily = daily.slice(1,6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    })

    hourly = hourly.slice(1,6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        }
    })

    return {timezone, daily, hourly}
}

const getFormattedWeatherData = async (searchParam) => {
    const formattedCurrentWeather = await getWeatherData
    ('weather', searchParam).then(formatCurrentWeather)

    const  {lat, lon} = formattedCurrentWeather

    const formattedForcastWeather = await getWeatherData('onecall', {
        lat, 
        lon, 
        exclude: 'current,minutely,alerts', 
        units: searchParam.units,
    }).then(formatForecastWeather)

    return {...formatCurrentWeather, ...formattedForcastWeather};
}

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).
setZone(zone).toformat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`

export default getFormattedWeatherData

export {formatToLocalTime, iconUrlFromCode};

