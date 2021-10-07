<script>
    import Nav from './nav.svelte'
    import Ads from './ads.svelte'
</script>

<div class='p-8 mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'>
    <Nav />
    <slot />
    <Ads />
</div>

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>