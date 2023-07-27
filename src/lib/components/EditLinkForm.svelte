<script lang="ts">
    import { db, user } from "$lib/firebase";
    import {
        arrayRemove,
        arrayUnion,
        doc,
        updateDoc,
    } from "firebase/firestore";
    import { writable } from "svelte/store";

    type Link = {
        icon: string;
        title: string;
        url: string;
        id: string;
    };

    export let link: Link;

    const icons = [
        "Twitter",
        "YouTube",
        "TikTok",
        "LinkedIn",
        "GitHub",
        "Custom",
    ];

    const formData = writable({
        icon: link.icon,
        title: link.title,
        url: link.url,
    });

    async function updateLink() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            links: arrayUnion({ ...$formData, id: Date.now().toString() }),
        });

        await updateDoc(userRef, {
            links: arrayRemove({
                icon: link.icon,
                url: link.url,
                title: link.title,
                id: link.id,
            }),
        });
    }

    async function deleteLink() {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(link),
        });
    }

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;
    $: titleIsTouched = $formData.title != link.title;
</script>

<h1 class="font-bold text-lg">Edit link</h1>
<div class="flex flex-col gap-4">
    <label for="icon" class="label opacity-40">Link logo</label>
    <select
        name="icon"
        class="select select-bordered"
        bind:value={$formData.icon}
    >
        {#each icons as icon}
            <option value={icon.toLowerCase()}>{icon}</option>
        {/each}
    </select>
    <label for="title" class="label opacity-40">Link title</label>
    <input
        name="title"
        type="text"
        placeholder="Title"
        class="input input-bordered"
        bind:value={$formData.title}
    />
    {#if titleIsTouched && !titleIsValid}
        <p class="text-error text-xs">Your title is too long!</p>
    {/if}
    <label for="url" class="label opacity-40">Link url</label>
    <input
        name="url"
        type="text"
        placeholder="URL"
        class="input input-bordered"
        bind:value={$formData.url}
    />
    {#if !urlIsValid}
        <p class="text-error text-xs">Must have a valid URL</p>
    {/if}
</div>

<div class="flex justify-between items-center">
    <div class="modal-action justify-center">
        <button
            disabled={!formIsValid}
            on:click={updateLink}
            class="btn btn-success block">Save Link</button
        >

        <button class="btn">Close</button>
    </div>
    <button
        on:click={deleteLink}
        class="btn btn-square btn-error btn-outline mt-6"
    >
        <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
        </svg>
    </button>
</div>
