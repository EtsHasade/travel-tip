'use strict';

export const locationService = {
    setNewLocation,
    getLocationsForDisplay,
}

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

const gLocations = gDefaultLocations;

function setNewLocation({lat, lng },...[address]) {
    gLocations.push({
        id: gNextId++,
        address: (address || 'UnKnown'),
        name: 'unKnown',
        lat,
        lng,
        weather: 'hut',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate()
    })    
}


function getLocationsForDisplay() {
    return getLocations()
}

function getLocations() {
    return gLocations;
}