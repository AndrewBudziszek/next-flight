import { writable } from "svelte/store";

export const flights = writable([]);

export const fetchFlights = async (airportCode) => {
    const username = import.meta.env.VITE_AERO_API_USERNAME
    const apikey = import.meta.env.VITE_AERO_API_KEY
    const url = `http://flightxml.flightaware.com/json/FlightXML2/Scheduled?airport=${airportCode}&howMany=5&filter=airline&offset=0`;
    let headers = new Headers();
    headers.set('Authorization', `Basic ` + Buffer.from(username + ':' + apikey).toString('base64'));
    const res = await fetch(url);
    const data = await res.json();
    flights.set(data);
}