export const mapService = {
    getLocs,
    searchAddress,
    getWeather
}

var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function searchAddress(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAygmMRDmE5l3JX0JxP9hmDtHdl5Tnddes`)
        .then(res => res.data.results[0])
}


function getWeather(lat,lng) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&&lon=${lng}&units=metric&APPID=c153ea6578562393b45a599c88fcc08c`)
        .then(res => res.data)
}


