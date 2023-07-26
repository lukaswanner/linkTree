<script lang="ts">
    import { page } from "$app/stores";
    import UserLink from "$lib/components/UserLink.svelte";
</script>

<main class="flex flex-col justify-center items-center h-screen mx-auto gap-8">
    <h1 class="font-bold text-8xl">404</h1>
    <a href="/">
        <img src="/logo.png" alt="logo" />
    </a>

    <div class="flex flex-col items-center">
        <p class="text-2xl">Seems like you're lost</p>
        <p class="text-2xl">Why not try some of those options?</p>
    </div>

    <div class="flex flex-col gap-4 w-full items-center">
        <UserLink url="/" title="Take me home" />
        <UserLink url="/signup" title="Create @{$page.error?.data?.username}" />
    </div>
</main>
