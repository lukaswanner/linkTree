<script lang="ts">
    import Tag from "$lib/components/Tag.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import type { PageData } from "./$types";
    import { scale } from "svelte/transition";

    export let data: PageData;

    let links = true;
    let info = false;
    let posts = false;
</script>

<svelte:head>
    <title>@{data.username} Links</title>
    <meta name="description" content={data.bio} />
</svelte:head>

<main class="flex flex-col gap-5 items-center text-center mx-auto mt-8">
    <img
        src={data.photoURL ?? "/user.png"}
        alt="photoURL"
        width="256"
        class="mx-auto rounded-full"
    />
    <h1 class=" text-5xl">
        {data.username}
    </h1>
    {#if data?.tags.length}
        <div class="flex flex-row items-center justify-center gap-3">
            {#each data?.tags as tag}
                <Tag {tag} />
            {/each}
        </div>
    {/if}
    <div class="flex flex-row gap-5 mt-3">
        <button
            class="text-xl"
            on:click={() => {
                links = true;
                info = false;
                posts = false;
            }}
            class:opacity-50={!links}>Links</button
        >
        <button
            class="text-xl"
            on:click={() => {
                links = false;
                info = true;
                posts = false;
            }}
            class:opacity-50={!info}>Info</button
        >
        <button
            class="text-xl"
            on:click={() => {
                links = false;
                info = false;
                posts = true;
            }}
            class:opacity-50={!posts}>Posts</button
        >
    </div>
    {#if links}
        <ul
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
            class="list-none p-0"
        >
            {#each data.links as item}
                <li class="flex justify-center py-2">
                    <UserLink {...item} />
                </li>
            {/each}
        </ul>
    {:else if info}
        <p
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
        >
            {data.bio ?? "no bio yet..."}
        </p>
    {:else if posts}
        <p
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
        >
            No social media posts linked.
        </p>
    {/if}
</main>
