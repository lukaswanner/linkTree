<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    export let close: Function;

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
        title: "",
        url: "https://",
    };

    const formData = writable({
        icon: "custom",
        title: "",
        url: "https://",
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

        close();
    }

    function cancelLink() {
        formData.set(formDefaults);
        close();
    }

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;
    $: titleIsTouched = $formData.title.length > 0;
    $: urlIsTouched = $formData.url !== formDefaults.url;
</script>

<form
    on:submit|preventDefault={addLink}
    class="bg-base-200 p-6 w-full mx-auto rounded-xl"
>
    <div class="flex flex-col gap-4">
        <select
            name="icon"
            class="select select-sm"
            bind:value={$formData.icon}
        >
            {#each icons as icon}
                <option value={icon.toLowerCase()}>{icon}</option>
            {/each}
        </select>
        <input
            name="title"
            type="text"
            placeholder="Title"
            class="input input-sm"
            bind:value={$formData.title}
        />
        <input
            name="url"
            type="text"
            placeholder="URL"
            class="input input-sm"
            bind:value={$formData.url}
        />
    </div>
    <div class="my-4">
        {#if titleIsTouched && !titleIsValid}
            <p class="text-error text-xs">Must have valid title</p>
        {/if}
        {#if urlIsTouched && !urlIsValid}
            <p class="text-error text-xs">Must have a valid URL</p>
        {/if}
        {#if formIsValid}
            <p class="text-success text-xs">Looks good!</p>
        {/if}
    </div>

    <div class="flex flex-row gap-4">
        <button
            disabled={!formIsValid}
            type="submit"
            class="btn btn-success block">Add Link</button
        >

        <button type="button" class="btn btn-error" on:click={cancelLink}
            >Cancel</button
        >
    </div>
</form>
