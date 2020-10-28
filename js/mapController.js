import { mapService } from './services/mapService.js'
import { locationService } from './services/LocationService.js'

var gMap;
console.log('Main!');

// Not sure this is the right place for this
window.onSearchAddress = onSearchAddress;

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
        })
})

/////////----------------------------------------///////////

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
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

                const latLng = {lat: mapsMouseEvent.latLng.lat(),lng: mapsMouseEvent.latLng.lng()};
                onSetNewLocation(latLng,'in my click location');
                // locationService.setNewLocation(latLng,'my-dog');
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
        panTo(res.geometry.location.lat, res.geometry.location.lng);
        addMarker({ lat: res.geometry.location.lat, lng: res.geometry.location.lng });
        locationService.setNewLocation(res.geometry.location, res.formatted_address);
        renderSelectedLocation(res.formatted_address)
    })

}

function renderSelectedLocation(address) {
    const elHeader = document.querySelector('.selected-address-display');
    elHeader.innerHTML = address;
}


function onSetNewLocation(latLng,...[name]) {
    locationService.setNewLocation(latLng, name);
    renderLocations()
}

function renderLocations() {
    const userLocs = locationService.getLocationsForDisplay()
    console.log("renderLocations -> userLocs", userLocs)

    let elLocationsList = document.querySelector('.location-list');
    elLocationsList.innerHTML = userLocs.map(loc => `
        <li>
            <h4 class="place-name">${loc.name} - ${loc.address}</h4>
            <h5> lat: ${loc.lat} / lng: ${loc.lng}</h5>
        </li>
    `).join('');
}