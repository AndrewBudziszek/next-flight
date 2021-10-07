<script>
	import NextFlightsList from './next-flights-list.svelte';
	import Ads from './ads.svelte';
	import { stationName, stationCode, fetchStation } from '../stores/closest-station-store';
	import { fetchFlights } from '../stores/flight-info-store';
	import Geolocation from 'svelte-geolocation';
	import { afterUpdate } from 'svelte';

	let coords = [];
	let attemptedToGetAirport = false;

	afterUpdate(async () => {
		if (coords.length > 0 && !attemptedToGetAirport) {
			attemptedToGetAirport = true;
			await fetchStation(coords[1], coords[0]);
			fetchFlights($stationCode);
		}
	});
</script>

<Geolocation getPosition bind:coords />
<div class="bg-white shadow-lg rounded-lg overflow-hidden">
	<div class="px-4 py-5 sm:p-6">
		<div class="flex items-center justify-between">
			<div class="flex-1 min-w-0">
				<h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
					Your closest airport is: <br /><span class="font-bold"
						>{$stationName ? $stationName : 'Loading...'}</span
					>
				</h3>
				<NextFlightsList />
			</div>
		</div>
	</div>
</div>

<Ads />
