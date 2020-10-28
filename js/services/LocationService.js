'use strict';

import {storage} from './storage-service.js';

export const locationService = {
    setNewLocation,
    getLocationsForDisplay,
}

const USER_LOCS_KEY = 'userLocs';

var gNextId = 1001;
const gDefaultLocations = [
    {
        id: gNextId++,
        address: 'here',
        name: 'My home',
        lat: 11.22, lng: 22.11,
        weather: 'wet',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate(),
    },
    {
        id: gNextId++,
        address: 'Far away',
        name: 'My work',
        lat: 11.55, lng: 22.50,
        weather: 'hut',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate()
    },
]

// const gLocations =  gDefaultLocations;
const gLocations = (loadUserLocs() || gDefaultLocations);
window.gLocations = gLocations;

function setNewLocation({lat, lng },...[address]) {
    gLocations.push({
        id: gNextId++,
        address: (address || 'UnKnown'),
        name: 'unKnown place',
        lat,
        lng,
        weather: 'hut',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate()
    })   
    saveUserLocs(); 
}


function getLocationsForDisplay() {
    return getLocations()
}

function getLocations() {
    return gLocations;
}


function saveUserLocs() {
    storage.saveToStorage(USER_LOCS_KEY, gLocations);
}

function loadUserLocs() {
    return storage.loadFromStorage(USER_LOCS_KEY)
}