import { writable } from "svelte/store";
import axios from 'axios';

export const flights = writable([]);

export const fetchFlights = async (airportCode) => {
    console.log(`Fetching flights for ${airportCode}`)
    var currentTime = dateBuilder(new Date());
    var futureTime = dateBuilder(new Date(new Date().getTime() + 12 * 60 * 60 * 1000));
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
    if (res.data) {
        let upcomingFlights = filterFlights(res.data.departures);
        if (upcomingFlights.length > 5) {
            upcomingFlights = upcomingFlights.slice(0, 5);
        }
        flights.set(upcomingFlights);
    } else {
        flights.set('No flights found within the next 12 hours...');
    }
};

function filterFlights(flights) {
    let filteredFlights = [];
    let unsupportedAirlines = ['Kabo Air', 'FLC', 'NKT']
    flights.forEach(flight => {
        if (flight.arrival.airport.icao === undefined) {
            if (flight.arrival.airport.name === 'Minneapolis') {
                flight.arrival.airport.icao = 'KMSP';
            } else if (flight.arrival.airport.name === 'Chicago') {
                flight.arrival.airport.icao = 'KORD';
            } else if (flight.arrival.airport.name === 'Los Angeles') {
                flight.arrival.airport.icao = 'KLAX';
            } else {
                return;
            }
        } else if (unsupportedAirlines.includes(flight.airline.name)) {
            return;
        } else {
            filteredFlights.push(flight);
        }
    });
    return filteredFlights.sort((a, b) => { a.departure.scheduledTimeLocal - b.departure.scheduledTimeLocal });
}

function dateBuilder(date) {
    //Convert date to YYYY-MM-DDTHH:MM
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();

    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
    }
    if (min.toString().length == 1) {
        min = '0' + min;
    }

    return year + '-' + month + '-' + day + 'T' + hour + ':' + min;
}