<script lang="ts">
    import Post from "$lib/components/Post.svelte";
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
        <div
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
        >
            {#if data.links.length}
                <ul class="list-none p-0">
                    {#each data.links as item}
                        <li class="flex justify-center py-2">
                            <UserLink {...item} />
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-2xl">No links so far 😱</p>
            {/if}
        </div>
    {:else if info}
        <div
            class="w-full max-w-md"
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
        >
            {#if data.bio.length}
                <p class="text-2xl">
                    {data.bio}
                </p>
            {:else}
                <p class="text-2xl">No bio yet! 😎</p>
            {/if}
        </div>
    {:else if posts}
        <div
            class="w-full max-w-md"
            in:scale={{ duration: 250, delay: 250 }}
            out:scale={{ duration: 250 }}
        >
            {#if data.posts.length}
                <div class="flex flex-col items-center justify-center gap-5">
                    {#each data.posts as post}
                        <Post {...post} />
                    {/each}
                </div>
            {:else}
                <p class="text-2xl">No posts so far! 🥱</p>
            {/if}
        </div>
    {/if}
    <a class="fixed bottom-10 left-10" href="/">
        <img src="/logo.png" alt="logo" class="w-12" />
    </a>
</main>
