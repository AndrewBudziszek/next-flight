import { writable } from "svelte/store";
import axios from 'axios';

export const flights = writable([]);

export const fetchFlights = async (airportCode) => {
    console.log(`Fetching flights for ${airportCode}`)
    var currentTime = new Date().toISOString();
    currentTime = currentTime.substr(0, currentTime.lastIndexOf(':'));
    var futureTime = new Date().setTime(new Date().getTime() + (12 * 60 * 60 * 1000));
    futureTime = new Date(futureTime).toISOString();
    futureTime = futureTime.substr(0, futureTime.lastIndexOf(':'));
    console.log(`Current time: ${currentTime}`);
    console.log(`Future time: ${futureTime}`);

    var options = {
        method: 'GET',
        url: `https://aerodatabox.p.rapidapi.com/flights/airports/icao/${airportCode}/${currentTime}/${futureTime}`,
        params: {
            withLeg: 'true',
            direction: 'Departure',
            withCancelled: 'false',
            withCodeshared: 'false',
            withCargo: 'false',
            withPrivate: 'false',
            withLocation: 'false'
        },
        headers: {
            'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
            'x-rapidapi-key': import.meta.env.VITE_RAPID_API_API_KEY
        }
    };


    let res = await axios.request(options)
    console.log(res);
    if(res.data) {
        let upcomingFlights = res.data.departures;
        if(upcomingFlights.length > 5) {
            upcomingFlights = upcomingFlights.slice(0, 5);
        }
        flights.set(upcomingFlights);
    } else {
        flights.set('No flights found within the next 12 hours...');
    }
};