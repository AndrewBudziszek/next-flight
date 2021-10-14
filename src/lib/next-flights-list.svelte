<script>
	import { flights } from '../stores/flight-info-store';
	import { stationName, getAirportName } from '../stores/closest-station-store';
</script>

<!--Create a rounded table that lists flights using TailwindCSS and Svelte-->
<div class="container mx-auto px-4">
	<div class="flex flex-wrap -mx-3 mb-6">
		<div class="w-full px-3">
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="p-3">
					<div class="text-center">
						<h3 class="text-xl font-semibold">The next flights outta here</h3>
					</div>
					<div class="-my-2 py-2 overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th
										class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
									>
										Flight
									</th>
									<th
										class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
									>
										Origin
									</th>
									<th
										class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
									>
										Destination
									</th>
									<th
										class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
									>
										Price
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each $flights as flight}
									<tr>
										<td
											class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
										>
											<div class="flex items-center">
												<div class="text-sm font-medium text-blue-600">
													<a target="_blank" href="{flight.affiliateLink}">
														{flight.number.replace(' ', '')}
														({flight.airline.name})
													</a>
												</div>
											</div>
										</td>
										<td
											class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
										>
											<div class="flex items-center">
												<div class="text-sm font-medium text-gray-900">
													{$stationName}<br />
													{flight.formattedDepartureTime}
												</div>
											</div>
										</td>
										<td
											class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
										>
											<div class="flex items-center">
												<div class="text-sm font-medium text-gray-900">
													{getAirportName(flight.arrival.airport.icao)}<br />
													{flight.formattedArrivalTime}
												</div>
											</div>
										</td>
										<td
											class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
										>
											<div class="flex items-center">
												<div class="text-sm font-medium text-green-500">${flight.avgPrice}</div>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
