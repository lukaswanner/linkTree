<script lang="ts">
    import { page } from "$app/stores";
    import SortableList from "$lib/components/SortableList.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import {
        arrayRemove,
        arrayUnion,
        doc,
        setDoc,
        updateDoc,
    } from "firebase/firestore";
    import { writable } from "svelte/store";

    type Link = {
        icon: string;
        title: string;
        url: string;
        id: string;
    };

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

    let showForm = false;

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;
    $: titleIsTouched = $formData.title.length > 0;
    $: urlIsTouched = $formData.url !== formDefaults.url;

    function sortList(e: CustomEvent) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
    }

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

        showForm = false;
    }

    async function deleteLink(item: Link) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

    async function toggleProfileStatus() {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            published: !$userData?.published,
        });
    }

    function cancelLink() {
        formData.set(formDefaults);
        showForm = false;
    }
</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <div class="text-center mb-8">
            <p>
                Profile Link:
                <a href={`/${$userData?.username}`} class="link link-accent">
                    https://todo.change/{$userData?.username}
                </a>
            </p>
        </div>

        <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">
            @{$userData?.username}
        </h1>

        <img
            src={$userData.photoURL ?? "/user.png"}
            alt="photoURL"
            width="256"
            class="mx-auto rounded-full"
        />

        <div
            class="flex flex-row gap-4 items-center justify-center text-center my-4"
        >
            <a class="btn btn-outline btn-xs" href="/login/photo"
                >Change photo</a
            >
            <a
                class="btn btn-outline btn-xs"
                href={`/${$userData.username}/bio`}>Edit Bio</a
            >
        </div>

        <form class="form-control">
            <label class="label cursor-pointer flex items-start justify-center">
                <span class="label-text mr-6">
                    <div
                        class="tooltip group-hover:tooltip-open"
                        data-tip="If public, the world can see your profile"
                    >
                        {$userData?.published
                            ? "Public profile"
                            : "Private profile"}
                    </div>
                </span>
                <input
                    type="checkbox"
                    class="toggle toggle-success"
                    checked={$userData?.published}
                    on:change={toggleProfileStatus}
                />
            </label>
        </form>

        {#if !showForm}
            <button
                on:click={() => (showForm = true)}
                class="btn btn-outline btn-info block mx-auto my-4"
            >
                Add a Link
            </button>
        {:else}
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

                    <button
                        type="button"
                        class="btn btn-error"
                        on:click={cancelLink}>Cancel</button
                    >
                </div>
            </form>
        {/if}

        <SortableList list={$userData?.links} on:sort={sortList} let:item>
            <div class="group relative">
                <UserLink {...item} />
                <button
                    on:click={() => deleteLink(item)}
                    class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 bottom-10"
                    >Delete</button
                >
            </div>
        </SortableList>
    {/if}
</main>
