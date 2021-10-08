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
        if (upcomingFlights.length > 10) {
            upcomingFlights = upcomingFlights.slice(0, 10);
        }
        addFlightTrackerURLToFlights(upcomingFlights);
        console.log(upcomingFlights);
        flights.set(upcomingFlights);
    }
};

function addFlightTrackerURLToFlights(flights) {
    for (let i = 0; i < flights.length; i++) {
        let flight = flights[i];
        let baseURL = 'https://flightaware.com/live/flight/'
        let flightNumber = flight.number.substr(flight.number.indexOf(' ') + 1);
        let carrierCode = 'NONE';
        if (flight.airline.name === 'Southwest') {
            carrierCode = 'SWA'
        } else if (flight.airline.name === 'United') {
            carrierCode = 'UAL'
        } else if (flight.airline.name === 'American') {
            carrierCode = 'AAL'
        } else if (flight.airline.name === 'Delta') {
            carrierCode = 'DAL'
        } else if (flight.airline.name === 'Alaska') {
            carrierCode = 'ASA'
        } else if (flight.airline.name === 'JetBlue') {
            carrierCode = 'JBU'
        } else if (flight.airline.name === 'Spirit') {
            carrierCode = 'NKS'
        } else if (flight.airline.name === 'Frontier') {
            carrierCode = flight.number.startsWith('F9') ? 'F9' : 'FNT'
        } else if (flight.airline.name === 'Allegiant') {
            carrierCode = 'AAY'
        } else {
            carrierCode = flight.number.substr(0, flight.number.indexOf(' '));
            console.log(`Unsupported carrier code found: ${carrierCode}`);
        }
        flight.flightTrackerURL = `${baseURL}${carrierCode}${flightNumber}`;
        flight.formattedDepartureTime = moment(flight.departure.scheduledTimeLocal).format('MM/DD/YYYY hh:mm A');
        flight.formattedArrivalTime = moment(flight.arrival.scheduledTimeLocal).format('MM/DD/YYYY hh:mm A');
    }
}

function filterFlights(flights) {
    let filteredFlights = [];
    let unsupportedAirlines = ['Kabo Air', 'FLC', 'NKT', 'COL', 'DVY', 'SIS', 'CNS', 'Nolinor', 'Swift Air']
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