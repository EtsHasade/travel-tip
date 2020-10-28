export const mapService = {
    getLocs: getLocs,
    searchAddress
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
        // return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`)
        .then(res => res.data.results[0].geometry.location)
}


