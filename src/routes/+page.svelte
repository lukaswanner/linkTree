<script lang="ts">
    import { user } from "$lib/firebase";
</script>

<svelte:head>
    <title>Todo.change - a place for links</title>
    <meta
        name="description"
        content="Demo project for the Full SvelteKit Course by Fireship"
    />
</svelte:head>

<main class="flex w-full flex-1">
    <div class="hero bg-base-200">
        <div class="hero-content text-center">
            <div class="w-full">
                <h1 class="text-7xl font-bold">Todo.change</h1>
                <p class="py-6 text-2xl">
                    One simple link to share your entire developer portfolio
                </p>
                {#if $user}
                    <a href="/{$user?.displayName}/edit" class="btn btn-primary"
                        >Edit Profile</a
                    >
                {:else}
                    <a href="/login" class="btn btn-primary">Get Started</a>
                    <a href="/fireship" class="btn btn-secondary"
                        >Example Profile</a
                    >
                {/if}
            </div>
        </div>
    </div>
</main>
