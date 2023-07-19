<script lang="ts">
    import { userData } from "$lib/firebase";
</script>

<svelte:head>
    <title>Lighthouse - shine light on you</title>
    <meta name="description" content="one link to rule them all" />
</svelte:head>

<main class="flex w-full flex-1">
    <div class="hero">
        <div class="hero-content text-center">
            <div class="w-full">
                <h1 class="text-7xl font-bold">Lighthouse</h1>
                <p class="py-6 text-2xl">
                    Shine a light on your online presence
                </p>
                {#if $userData}
                    <a href="/{$userData.username}/edit" class="btn btn-primary"
                        >Edit Profile</a
                    >
                {:else}
                    <div
                        class="flex flex-row gap-2 justify-center items-center"
                    >
                        <a href="/signup" class="btn btn-primary">Get Started</a
                        >
                        <a href="/Lukas" class="btn btn-secondary"
                            >Example Profile</a
                        >
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    .hero {
        background-image: url("/background.jpg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }

    .hero::after {
        content: "";
        inset: 0;
        position: absolute;
        background: rgba(57, 57, 57, 0.7);

        /* center overlay text */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hero-content {
        z-index: 10;
    }
</style>
