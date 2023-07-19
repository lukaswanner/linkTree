<script lang="ts">
    import { userData } from "$lib/firebase";
</script>

<svelte:head>
    <title>Lighthouse - shine light on you</title>
    <meta name="description" content="one link to rule them all" />
</svelte:head>

<main class="flex w-full">
    <div class="hero bg-base-200">
        <div class="hero-content text-center">
            <div class="w-full">
                <h1 class="text-7xl font-bold">Lighthouse</h1>
                <p class="py-6 text-2xl">Shine a light on your online self</p>
                {#if $userData}
                    <a href="/{$userData.username}/edit" class="btn btn-primary"
                        >Edit Profile</a
                    >
                {:else}
                    <a href="/signup" class="btn btn-primary">Get Started</a>
                    <a href="/Lukas" class="btn btn-secondary"
                        >Example Profile</a
                    >
                {/if}
            </div>
        </div>
    </div>
</main>
