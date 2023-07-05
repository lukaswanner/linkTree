<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import { user, userData } from "$lib/firebase";
    import "../app.css";
    import type { LayoutServerData } from "./$types";

    // preload global data that we use in child components
    $user;
    $userData;
    export let data: LayoutServerData;
</script>

<svelte:head>
    <link rel="icon" href="https://fav.farm/🪶" />
    <title>Plume</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
    <Navbar username={data.user?.username} />
    <slot />
</div>
