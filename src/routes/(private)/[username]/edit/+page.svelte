<script lang="ts">
    import { page } from "$app/stores";
    import AddLinkForm from "$lib/components/AddLinkForm.svelte";
    import EditLinkForm from "$lib/components/EditLinkForm.svelte";
    import SortableList from "$lib/components/SortableList.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import { arrayRemove, doc, setDoc, updateDoc } from "firebase/firestore";

    type Link = {
        icon: string;
        title: string;
        url: string;
        id: string;
    };

    let showForm = false;
    let loading = false;
    let done = false;
    let currentItem: Link;
    let editLink: HTMLDialogElement;

    function sortList(e: CustomEvent) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
    }

    async function deleteLink(item: Link) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

    async function toggleProfileStatus() {
        // disable if we are still in animation
        if (loading || done) return;

        loading = true;
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            published: !$userData?.published,
        });
        setTimeout(() => {
            loading = false;
            done = true;
            setTimeout(() => {
                done = false;
            }, 2000);
        }, 2000);
    }
</script>

<main class="max-w-xl mx-auto flex flex-col gap-4">
    {#if $userData?.username == $page.params.username}
        <img
            src={$userData.photoURL ?? "/user.png"}
            alt="photoURL"
            width="360"
            class="mx-auto rounded-xl"
        />

        <div class="mt-8 mb-4 flex flex-row items-center justify-between">
            <h1 class="text-3xl text-center">
                Welcome {$userData?.username}
            </h1>
        </div>

        <p class="base-content">
            Manage your links, photo and publish your profile.
        </p>

        <div class="flex gap-4">
            <button
                class="btn btn-outline relative customButton rounded-lg w-[8ch]"
                class:publishing={loading}
                class:published={done}
                class:btn-success={$userData?.published}
                class:btn-error={!$userData?.published}
                on:click={toggleProfileStatus}
            >
                {$userData?.published ? "Public" : "Private"}
                <div class="hiddenIconWrapper">
                    <span
                        class="loading loading-spinner hiddenIcon text-base-content"
                    />
                </div>
                <div class="hiddenCheckmarkWrapper">
                    <svg
                        class="hiddenIcon text-base-content"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                        /></svg
                    >
                </div>
            </button>
            <button class="btn btn-outline rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                        d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
                    /></svg
                >
                <p class="text-">Copy link</p>
            </button>
        </div>
        <div class="divider my-0" />

        <div
            class="flex flex-row gap-4 items-center justify-center text-center"
        >
            <a
                class="btn btn-outline flex-1"
                href={`/${$userData.username}/edit/bio`}>Edit Bio</a
            >
            <a
                on:click={() => void 0}
                href="/{$userData.username}/edit/photo"
                class="btn btn-outline flex-1"
            >
                Edit Picture
            </a>
        </div>

        <div class="divider my-0" />
        {#if !showForm}
            <button
                on:click={() => (showForm = true)}
                class="btn btn-outline mr-auto"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    height="1em"
                    viewBox="0 0 448 512"
                    ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                        d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                    />
                </svg>
                Link
            </button>
        {:else}
            <AddLinkForm close={() => (showForm = false)} />
        {/if}

        <SortableList list={$userData?.links} on:sort={sortList} let:item>
            <div class="group relative">
                <UserLink
                    editMode
                    {...item}
                    openModal={() => {
                        currentItem = item;
                        editLink.showModal();
                    }}
                />
                <button
                    on:click={() => {
                        currentItem = item;
                        editLink.showModal();
                    }}
                    class="btn btn-xs btn-secondary invisible group-hover:visible transition-all absolute -right-6 -top-2"
                    >Edit</button
                >
            </div>
        </SortableList>
        <dialog bind:this={editLink} class="modal">
            <form method="dialog" class="modal-box">
                {#key currentItem}
                    {#if currentItem}
                        <EditLinkForm {...currentItem} />
                    {/if}
                {/key}
            </form>
        </dialog>
    {/if}
</main>

<style>
    .customButton {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: width 0.25s ease 0.25s, border-radius 0.25s ease 0.25s,
            color 0s;
    }

    .publishing,
    .published {
        width: 3rem;
        height: 3rem;
        border-radius: 9999px;
        overflow: hidden;
        color: rgba(0, 0, 0, 0);
        border-color: hsl(var(--bc));
        transition: color 0s, width 0.25s ease 0.25s,
            border-radius 0.25s ease 0.25s;
    }

    .publishing:hover,
    .published:hover {
        background-color: inherit;
    }

    .publishing {
        animation: bounce 3s ease infinite;
    }

    .publishing .hiddenIconWrapper {
        inset: 0;
        opacity: 1;
        transition: opacity 0.25s ease 0.5s;
    }
    .hiddenIconWrapper,
    .hiddenCheckmarkWrapper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
    }

    .hiddenCheckmarkWrapper {
        transform: scale(0);
    }

    .published .hiddenCheckmarkWrapper {
        inset: 0;
        opacity: 1;
        transform: scale(1);
        transition: transform 0.25s ease 0.25s;
    }

    .hiddenIcon {
        height: 75%;
        width: 75%;
    }

    @keyframes bounce {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(0.9);
        }

        100% {
            transform: scale(1);
        }
    }
</style>
