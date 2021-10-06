import { writable } from "svelte/store";
import axios from 'axios';
import moment from 'moment';

export const flights = writable([]);

export const fetchFlights = async (airportCode) => {
    console.log(`Fetching flights for ${airportCode}`)
    var currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    var futureTime = moment().add(12, 'hours').format('YYYY-MM-DDTHH:mm:ss');
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