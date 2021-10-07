<script>
    import MainCard from '../lib/main-card.svelte';
    import {onMount} from 'svelte'
    onMount(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  })
</script>
<svelte:head><title>✈️Next Flight✈️</title></svelte:head>

<h1 class="text-white text-center my-8 text-4xl">✈️ Next Flight ✈️</h1>
<p class="text-white text-center">Find the next flight outta here!</p>
<MainCard/>
<ins 
    class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-9155380222623167"
    data-ad-slot="3792188932"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />