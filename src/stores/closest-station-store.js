import { writable } from "svelte/store";

export const stationCode = writable([]);
export const stationName = writable([]);
let airportCodes = []

export const fetchStation = async (lat, lon) => {
    let url = `https://api.weather.gov/points/${lat}%2C${lon}/stations`
    const res = await fetch(url);
    const data = await res.json();

    let bestStation = null;

    console.log('Finding closest weather station...')
    if (data.observationStations.length > 0) {
        for (let i = 0; i < data.observationStations.length && bestStation === null; i++) {
            let currentStation = data.observationStations[i].substring(data.observationStations[i].lastIndexOf('/') + 1);
            console.log(`Checking if ${currentStation} is a supported airport code...`);
            for (let j = 0; j < airportCodes.length && bestStation === null; j++) {
                if (airportCodes[j].airportCode === currentStation) {
                    console.log(`Found ${currentStation}! Setting station...`);
                    bestStation = currentStation;
                    stationCode.set(bestStation);
                    stationName.set(airportCodes[j].airportName);
                }
            }
            if (bestStation === null) {
                console.log(`${currentStation} is not a supported airport code.`);
            }
        }
    }

    if (bestStation === null) {
        console.log('No weather station found.');
        stationName.set('No supported airport found close by.');
    }
}

function addAirportCode(code, name) {
    airportCodes.push({ airportCode: code, airportName: name });
}

export const getAirportName = (code) => {
    for (let i = 0; i < airportCodes.length; i++) {
        if (airportCodes[i].airportCode === code) {
            return airportCodes[i].airportName;
        }
    }
    return null;
}

addAirportCode('KATL', 'Hartsfield–Jackson Atlanta International Airport');
addAirportCode('KLAX', 'Los Angeles International Airport');
addAirportCode('KORD', 'O\'Hare International Airport');
addAirportCode('KDFW', 'Dallas-Fort Worth International Airport');
addAirportCode('KDEN', 'Denver International Airport');
addAirportCode('KJFK', 'John F. Kennedy International Airport');
addAirportCode('KSFO', 'San Francisco International Airport');
addAirportCode('KLAS', 'McCarran international Airport');
addAirportCode('CYYZ', 'Toronto Pearson International Airport');
addAirportCode('KSEA', 'Seattle-Tacoma International Airport');
addAirportCode('KCLT', 'Charlotte Douglas International Airport');
addAirportCode('KMCO', 'Orlando International Airport');
addAirportCode('KMIA', 'Miami International Airport');
addAirportCode('KPHX', 'Phoenix Sky Harbor International Airport');
addAirportCode('KEWR', 'Newark Liberty International Airport');
addAirportCode('KIAH', 'George Bush Intercontinental Airport');
addAirportCode('KMSP', 'Minneapolis–Saint Paul International Airport');
addAirportCode('KBOS', 'Logan International Airport');
addAirportCode('KDTW', 'Detroit Metropolitan Wayne County Airport');
addAirportCode('KFLL', 'Fort Lauderdale–Hollywood International Airport');
addAirportCode('KORL', 'Orlando Executive Airport');
addAirportCode('KLGA', 'LaGuardia Airport');
addAirportCode('KPHL', 'Philadelphia International Airport');
addAirportCode('KBWI', 'Baltimore-Washington International Airport');
addAirportCode('KSLC', 'Salt Lake City International Airport');
addAirportCode('CYVR', 'Vancouver International Airport');
addAirportCode('KDCA', 'Ronald Reagan Washington National Airport');
addAirportCode('KIAD', 'Washington Dulles International Airport');
addAirportCode('KMDW', 'Chicago Midway International Airport');
addAirportCode('KSAN', 'San Diego International Airport');
addAirportCode('KHNL', 'Daniel K. Inouye International Airport');
addAirportCode('KTPA', 'Tampa International Airport');
addAirportCode('KPDX', 'Portland International Airport');
addAirportCode('CYUL', 'Montreal–Pierre Elliott Trudeau International Airport');
addAirportCode('CYYC', 'Calgary International Airport');
addAirportCode('KDAL', 'Dallas Love Field');
addAirportCode('KSTL', 'Lambert–St. Louis International Airport');
addAirportCode('KBNA', 'Nashville International Airport');
addAirportCode('KAUS', 'Austin-Bergstrom International Airport');
addAirportCode('KHOU', 'William P. Hobby Airport');
addAirportCode('KOAK', 'Metropolitan Oakland International Airport');
addAirportCode('KSJC', 'Norman Y. Mineta San Jose International Airport');
addAirportCode('KMSY', 'Louis Armstrong New Orleans International Airport');
addAirportCode('KRDU', 'Raleigh-Durham International Airport');
addAirportCode('KMCI', 'Kansas City International Airport');
addAirportCode('KSMF', 'Sacramento International Airport');
addAirportCode('KSNA', 'John Wayne Airport');
addAirportCode('KCLE', 'Cleveland Hopkins International Airport');
addAirportCode('KSAT', 'San Antonio International Airport');
addAirportCode('KPIT', 'Pittsburgh International Airport');
addAirportCode('KRSW', 'Southwest Florida International Airport');
addAirportCode('KIND', 'Indianapolis International Airport');
addAirportCode('KCVG', 'Cincinnati/Northern Kentucky International Airport');
addAirportCode('CYEG', 'Edmonton International Airport');
addAirportCode('KCMH', 'Port Columbus International Airport');
addAirportCode('KBDL', 'Bradley International Airport');
addAirportCode('KPBI', 'Palm Beach International Airport');
addAirportCode('KJAX', 'Jacksonville International Airport');
addAirportCode('KANC', 'Ted Stevens Anchorage International Airport');
addAirportCode('KABQ', 'Albuquerque International Sunport Airport');
addAirportCode('CYOW', 'Ottawa Macdonald-Cartier International Airport');
addAirportCode('KBUF', 'Buffalo Niagara International Airport');
addAirportCode('KOMA', 'Eppley Airfield');
addAirportCode('KMKE', 'General Mitchell International Airport');
addAirportCode('KMSP', 'Minneapolis–Saint Paul International Airport');
addAirportCode('CYWG', 'Winnipeg James Armstrong Richardson International Airport');
addAirportCode('KONT', 'Ontario International Airport');
addAirportCode('CYHZ', 'Halifax Stanfield International Airport');
addAirportCode('KPVD', 'T.F. Green Airport');
addAirportCode('KKOA', 'Kona International At Keahole Airport');
addAirportCode('KLGB', 'Long Beach/Daugherty Field/Airport');
addAirportCode('KLIH', 'Lihue Airport');
addAirportCode('KELP', 'El Paso International Airport');
addAirportCode('CYTZ', 'Billy Bishop Toronto City Centre Airport');
addAirportCode('KSFB', 'Orlando Sanford International Airport');
addAirportCode('KALB', 'Albany International Airport');
addAirportCode('KBUR', 'Bob Hope Airport');
addAirportCode('KPSP', 'Palm Springs International Airport');
addAirportCode('KSYR', 'Syracuse Hancock International Airport');
addAirportCode('CYYJ', 'Victoria International Airport');
addAirportCode('CYLW', 'Kelowna International Airport');
addAirportCode('KPWM', 'Portland International Jetport Airport');
addAirportCode('CYQB', 'Quebec Jean Lesage International Airport');
addAirportCode('KPNS', 'Pensacola Regional Airport');
addAirportCode('KMHT', 'Manchester–Boston Regional Airport');
addAirportCode('KHPN', 'Westchester County Airport');
addAirportCode('CYXE', 'Saskatoon John G. Diefenbaker International Airport');
addAirportCode('KITO', 'Hilo International Airport');
addAirportCode('CYQR', 'Regina International Airport');
addAirportCode('KSRQ', 'Sarasota Bradenton International Airport');
addAirportCode('KROC', 'Greater Rochester International Airport');
addAirportCode('KBTV', 'Burlington International Airport');
addAirportCode('KPIE', 'St. Petersburg Clearwater International Airport');
addAirportCode('KECP', 'Northwest Florida Beaches International Airport');
addAirportCode('KFAT', 'Fresno Yosemite International Airport');
addAirportCode('KMFE', 'Mc Allen Miller International Airport');
addAirportCode('KTLH', 'Tallahassee Regional Airport');
addAirportCode('KAMA', 'Rick Husband Amarillo International Airport');
addAirportCode('KSBA', 'Santa Barbara Municipal Airport');
addAirportCode('KISP', 'Long Island Mac Arthur Airport');
