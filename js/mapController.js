import { mapService } from './services/mapService.js'
import { locationService } from './services/LocationService.js'

var gMap;

console.log('Main!');

// Not sure this is the right place for this
window.onSearchAddress = onSearchAddress;
window.checkWeather = checkWeather;
/////-------- add event listeners to DOM element here -----------///

document.querySelector('.my-location-btn').addEventListener('click', (ev) => {
    console.log('My location clicked');
    getPosition()
        .then(pos => {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            console.log('Got pos >> lat: ', lat, 'lng: ', lng);
            panTo(lat, lng);
            addMarker({ lat: lat, lng: lng });
            checkWeather(lat, lng);
            // renderLocations();
        })
})

/////////----------------------------------------///////////

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
            checkWeather(32.0749831, 34.9120554);
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    renderLocations()
}

var infoWindow;
export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
        .then(() => {
            infoWindow = new google.maps.InfoWindow({
                content: "You are here",
                position: { lat, lng },
            });
            infoWindow.open(gMap);
            console.log('initial info window');
        })
        .then(() => {

            //// --------- add event listener for gMap here ------ ///
            gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();

                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });
                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                );

                infoWindow.open(gMap);

                const latLng = { lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() };
                onSetNewLocation(latLng, 'in my click location');
                checkWeather(lat, lng);
            });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAygmMRDmE5l3JX0JxP9hmDtHdl5Tnddes';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function onSearchAddress(ev) {
    if (ev) ev.preventDefault();

    const elInputAddress = document.querySelector('input[name=search]');
    const prmAns = mapService.searchAddress(elInputAddress.value);
    prmAns.then((res) => {
        console.log(res.formatted_address)
        var lat = res.geometry.location.lat;
        var lng = res.geometry.location.lng;
        panTo(lat, lng);
        addMarker({ lat: lat, lng: lng });
        locationService.setNewLocation(res.geometry.location, res.formatted_address);
        renderSelectedLocation(res.formatted_address);
        checkWeather(lat, lng);
    })
}

function renderSelectedLocation(address) {
    const elHeader = document.querySelector('.selected-address-display');
    elHeader.innerHTML = address;
}


function onSetNewLocation(latLng, ...[name]) {
    locationService.setNewLocation(latLng, name);
    renderLocations()
}

function renderLocations() {
    const userLocs = locationService.getLocationsForDisplay()
    console.log("renderLocations -> userLocs", userLocs)

    let elLocationsList = document.querySelector('.location-list');
    elLocationsList.innerHTML = userLocs.map(loc => `
    <tr>
        <td class="place-name">${loc.name} - ${loc.address}</td>
        <td> lat: ${loc.lat.toFixed(5)}</td>
        <td> lng: ${loc.lng.toFixed(5)}</td>
    </tr>
    `).join('');
}

function checkWeather(lat, lng) {
    const prmAns = mapService.getWeather(lat, lng);
    prmAns.then((res) => {
        console.log(res)
        renderWeather(res)
    })
}

function renderWeather(res) {
    const elWeatherDetails = document.querySelector('.weater-details');
    var strHTML = `
        <li>general description: ${res.weather[0].description}</li>
        <li>min temp: ${res.main.temp_min}</li>
        <li>max temp: ${res.main.temp_max}</li>
        <li>Feels like: ${res.main.feels_like}</li>
    `
    elWeatherDetails.innerHTML = strHTML;
}
