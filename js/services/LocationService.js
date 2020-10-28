'use strict';

export const locationService = {
    setNewLocation,
}

var gNextId = 1001;
const gDefaultLocations = [
    {
        id: gNextId++,
        name: 'My home',
        lat: 11.22, lng: 22.11,
        weather: 'wet',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate(),
    },
    {
        id: gNextId++,
        name: 'My work',
        lat: 11.55, lng: 22.50,
        weather: 'hut',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate()
    },
]

const gLocations = gDefaultLocations;

function setNewLocation({lat, lng },...[name]) {
    gLocations.push({
        id: gNextId++,
        name: (name || 'UnKnown'),
        lat,
        lng,
        weather: 'hut',
        createdAt: new Date().getDate(),
        updatedAt: new Date().getDate()
    })    
    console.log('set new location',);
    console.log("setNewLocation -> lat, lng ", lat, lng )
    console.log('gloc', gLocations);
}