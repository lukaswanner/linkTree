<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    const icons = [
        "Twitter",
        "YouTube",
        "TikTok",
        "LinkedIn",
        "GitHub",
        "Custom",
    ];

    const formDefaults = {
        icon: "custom",
        title: "Your title",
        url: "https://yourLink.com",
    };

    const formData = writable({
        icon: "custom",
        title: "Your title",
        url: "https://yourLink.com",
    });

    async function addLink() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            links: arrayUnion({
                ...$formData,
                id: Date.now().toString(),
            }),
        });

        formData.set({
            icon: "",
            title: "",
            url: "",
        });
    }

    function cancelLink() {
        formData.set(formDefaults);
    }

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;
    $: urlIsTouched = $formData.url !== formDefaults.url;
</script>

<h1 class="font-bold text-lg">Add new link</h1>
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
    {#if !titleIsValid}
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
    {#if urlIsTouched && !urlIsValid}
        <p class="text-error text-xs">Must have a valid URL</p>
    {/if}
</div>

<div class="modal-action">
    <button
        disabled={!formIsValid}
        on:click={addLink}
        class="btn btn-success block">Add Link</button
    >

    <button class="btn btn-error" on:click={cancelLink}>Cancel</button>
</div>
