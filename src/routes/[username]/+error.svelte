<script lang="ts">
    import { page } from "$app/stores";
    import UserLink from "$lib/components/UserLink.svelte";
</script>

<main class="prose flex flex-col justify-center items-center h-screen mx-auto">
    <h1 class="text-5xl">
        The user @{$page.error?.data?.username} you're looking for doesn't exist.
    </h1>

    <p class="text-2xl text-info mt-8">Want this to be your username?</p>

    <div class="flex flex-col gap-4 w-full items-center mt-8">
        <UserLink title="Home" url="/" />
        <UserLink title="Create @{$page.error?.data?.username}" url="/login" />
    </div>
</main>
