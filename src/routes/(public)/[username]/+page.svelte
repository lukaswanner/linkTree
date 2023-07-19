<script lang="ts">
    import UserLink from "$lib/components/UserLink.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>@{data.username} Links</title>
    <meta name="description" content={data.bio} />
</svelte:head>

<main class="text-center mx-auto mt-8">
    <h1 class="font-bold text-7xl text-purple-500 my-8">
        @{data.username}
    </h1>

    <img
        src={data.photoURL ?? "/user.png"}
        alt="photoURL"
        width="256"
        class="mx-auto rounded-full"
    />

    <p class="text-xl my-8">{data.bio ?? "no bio yet..."}</p>
    <ul class="list-none p-0">
        {#each data.links as item}
            <li class="flex justify-center my-2">
                <UserLink {...item} />
            </li>
        {/each}
    </ul>
</main>
