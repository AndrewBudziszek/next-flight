<script>
    import NextFlightsList from "./next-flights-list.svelte";

</script>


<div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
                <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
                    Your closest airport is: <br/><span class="font-bold">General Mitchell International Airport - Milwaukee, WI</span>
                </h3>
                <NextFlightsList/>
            </div>
        </div>
    </div>
</div>