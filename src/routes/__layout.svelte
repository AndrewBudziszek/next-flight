<script>
    import Nav from './nav.svelte'
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2340680669187881"
     crossorigin="anonymous"></script>

<div class='p-8 mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'>
    <Nav />
    <slot />
</div>

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>