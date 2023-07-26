<script lang="ts">
    import { userData } from "$lib/firebase";
    import { onMount } from "svelte";
    import { draw, fly } from "svelte/transition";

    let ready = false;
    onMount(() => (ready = true));
</script>

<svelte:head>
    <title>Lighthouse - shine light on you</title>
    <meta name="description" content="one link to rule them all" />
</svelte:head>

<main class="w-full flex-1 flex flex-col gap-10 p-10">
    <div class="w-full flex flex-col items-center text-center mt-10">
        <h1 class=" text-7xl font-bold leading-[6rem]">
            Navigating the Digital Seas
        </h1>
        <p class="py-6 text-2xl">
            Discover a world of possibilities with Lighthouse.
        </p>
        <div>
            {#if $userData}
                <a href="/{$userData.username}/edit" class="btn btn-primary"
                    >Edit Profile</a
                >
            {:else}
                <div class="flex flex-row gap-2 justify-center items-center">
                    <a href="/signup" class="btn btn-primary">Get Started</a>
                    <a href="/Lukas" class="btn btn-secondary"
                        >Example Profile</a
                    >
                </div>
            {/if}
        </div>
        <img class="mt-4" src="/iPhone.png" alt="phone-showcase" />
    </div>
</main>
