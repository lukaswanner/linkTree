<script lang="ts">
    import { userData } from "$lib/firebase";
</script>

<svelte:head>
    <title>Lighthouse - shine light on you</title>
    <meta name="description" content="one link to rule them all" />
</svelte:head>

<main class="flex w-full flex-1">
    <div class="grid lg:grid-cols-2 gap-4 p-4">
        <div class="w-full">
            <h1 class="text-7xl font-bold leading-[6rem]">
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
        <div>
            <div
                class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl"
            >
                <img src="/logo.png" alt="lighthouse" />
            </div>
        </div>
    </div>
</main>
