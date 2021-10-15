import { get, writable } from "svelte/store";
import { stationCode, stationName } from "./closest-station-store";
import axios from 'axios';
import moment from 'moment';

export const flights = writable([]);
const unsupportedAirlines = ['Kabo Air', 'FLC', 'NKT', 'COL', 'DVY', 'SIS', 'CNS', 'Nolinor', 'Swift Air', 'TCA', 'NetJets Aviation', 'Contour Aviation', 'BTX', 'A8', 'Ameriflight'];

export const fetchFlights = async (airportCode) => {
    console.log(`Fetching flights for ${airportCode}`);
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
        addFlightTrackerURLToFlights(upcomingFlights);
        await addPriceDataToFlight(upcomingFlights);
        flights.set(upcomingFlights);
    }
};

async function addPriceDataToFlight(flights) {
    for(var i = 0; i < flights.length; i++) {
        let flight = flights[i]; 

        const baseURL = `https://flight-data-api.herokuapp.com/`;
        let origin = get(stationCode).substr(1); // origin in icao format
        let destination = flight.arrival.airport.icao.substr(1);
        let depart_date = moment(flight.departure.scheduledTimeLocal).format('YYYY-MM');
        let url = `${baseURL}price?origin=${origin}&destination=${destination}&depart_date=${depart_date}`;

        let res = await axios.get(url);
        flight.avgPrice = res.price;
    }
}

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
        } else if (flight.airline.name === 'Delta' || flight.airline.name === "Delta Air Lines") {
            carrierCode = 'DAL'
        } else if (flight.airline.name === 'Alaska') {
            carrierCode = 'ASA'
        } else if (flight.airline.name === 'JetBlue') {
            carrierCode = 'JBU'
        } else if (flight.airline.name === 'Spirit') {
            carrierCode = 'NKS'
        } else if (flight.airline.name === 'Frontier') {
            carrierCode = flight.number.startsWith('F9') ? 'F9' : 'FFT'
        } else if (flight.airline.name === 'Allegiant') {
            carrierCode = 'AAY'
        } else {
            carrierCode = flight.number.substr(0, flight.number.indexOf(' '));
            console.log(`Unsupported carrier code found: ${carrierCode}`, flight);
        }
        flight.flightTrackerURL = `${baseURL}${carrierCode}${flightNumber}`;
        flight.affiliateLink = createAffiliateLink(flight);
        flight.formattedDepartureTime = moment(flight.departure.scheduledTimeLocal).format('MM/DD/YYYY hh:mm A');
        flight.formattedArrivalTime = moment(flight.arrival.scheduledTimeLocal).format('MM/DD/YYYY hh:mm A');
    }
}

function createAffiliateLink(flight) {
    let baseURL = 'https://tp.media/r?marker=337003&trs=149718&p=4791&u=https%3A%2F%2Fsearch.jetradar.com%2Fflights%2F'
    let dateString = moment(flight.departure.scheduledTimeLocal).format('DDMM');
    let flightSearchCode = `${get(stationCode).substr(1)}${dateString}${flight.arrival.airport.icao.substr(1)}`;

    //At the end of the URL there are three integers: 120 represents 1 adult, 2 children, and 0 infants.
    return `${baseURL}${flightSearchCode}1`;
}

function filterFlights(flights) {
    let filteredFlights = [];
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
    if (filteredFlights.length > 10) {
        filteredFlights = filteredFlights.slice(0, 10);
    }
    let sortedFlights = filteredFlights.sort(function (left, right) {
        return moment.utc(left.departure.scheduledTimeLocal).diff(moment.utc(right.departure.scheduledTimeLocal))
    });
    return sortedFlights;
}
