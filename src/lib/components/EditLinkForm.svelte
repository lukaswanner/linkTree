<script lang="ts">
    import { db, user } from "$lib/firebase";
    import {
        arrayRemove,
        arrayUnion,
        doc,
        updateDoc,
    } from "firebase/firestore";
    import { writable } from "svelte/store";

    export let icon: string;
    export let url: string;
    export let title: string;
    export let id: string;

    const icons = [
        "Twitter",
        "YouTube",
        "TikTok",
        "LinkedIn",
        "GitHub",
        "Custom",
    ];

    const formData = writable({
        icon,
        title,
        url,
    });

    async function updateLink() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            links: arrayUnion({ ...$formData, id: Date.now().toString() }),
        });

        await updateDoc(userRef, {
            links: arrayRemove({
                icon,
                url,
                title,
                id,
            }),
        });
    }

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;
    $: titleIsTouched = $formData.title != title;
</script>

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
        <p class="text-error text-xs">Must have valid title</p>
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
<div class="my-4">
    {#if formIsValid}
        <p class="text-success text-xs">Looks good!</p>
    {/if}
</div>

<div class="modal-action">
    <button
        disabled={!formIsValid}
        on:click={updateLink}
        class="btn btn-success block">Save Link</button
    >

    <button class="btn btn-error">Close</button>
</div>
