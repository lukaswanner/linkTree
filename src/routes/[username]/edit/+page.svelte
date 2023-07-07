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

        <div class="group relative">
            <img
                src={$userData.photoURL ?? "/user.png"}
                alt="photoURL"
                width="256"
                class="mx-auto rounded-full"
            />
            <a
                on:click={() => void 0}
                href="/{$userData.username}/edit/photo"
                class="btn btn-sm btn-circle absolute right-9 top-2"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="Edit / Edit_Pencil_02">
                        <path
                            id="Vector"
                            d="M4 16.0001V20.0001L8 20.0001L18.8686 9.13146L18.8695 9.13061C19.265 8.73516 19.4628 8.53736 19.5369 8.3092C19.6021 8.10835 19.6022 7.89201 19.5369 7.69117C19.4627 7.46284 19.2646 7.26474 18.8686 6.86872L17.1288 5.12892C16.7345 4.7346 16.5369 4.53704 16.3091 4.46301C16.1082 4.39775 15.8919 4.39775 15.691 4.46301C15.463 4.53709 15.2652 4.73488 14.8704 5.12976L14.8686 5.13146L4 16.0001Z"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </g>
                </svg>
            </a>
        </div>

        <div
            class="flex flex-row gap-4 items-center justify-center text-center my-4"
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
