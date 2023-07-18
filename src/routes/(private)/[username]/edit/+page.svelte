<script lang="ts">
    import { page } from "$app/stores";
    import AddLinkForm from "$lib/components/AddLinkForm.svelte";
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

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <img
            src={$userData.photoURL ?? "/user.png"}
            alt="photoURL"
            width="360"
            class="mx-auto rounded-xl"
        />

        <h1 class="mt-4 text-3xl mb-4 text-center">
            Welcome {$userData?.username}
        </h1>

        <p class="base-content">
            Manage your links, photo and publish your profile.
        </p>

        <div class="divider" />

        <div
            class="flex flex-row gap-4 items-center justify-center text-center my-4"
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

        <form class="form-control">
            <label class="label cursor-pointer flex flex-row items-start gap-4">
                <span class="label-text">
                    <div
                        class="tooltip group-hover:tooltip-open"
                        data-tip="If public, the world can see your profile"
                    />
                </span>
                <button
                    class="btn relative customButton rounded-lg w-36"
                    class:publishing={loading}
                    class:published={done}
                    on:click={toggleProfileStatus}
                >
                    {$userData?.published ? "Published" : "Hidden"}
                    <div class="hiddenIconWrapper">
                        <span
                            class="loading loading-spinner hiddenIcon text-primary"
                        />
                    </div>
                    <div class="hiddenCheckmarkWrapper">
                        <svg
                            class="hiddenIcon text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            fill="currentColor"
                            ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                            /></svg
                        >
                    </div>
                </button>
            </label>
        </form>

        <div class="divider" />
        {#if !showForm}
            <button
                on:click={() => (showForm = true)}
                class="btn btn-outline btn-info block mx-auto my-4"
            >
                Add a Link
            </button>
        {:else}
            <AddLinkForm close={() => (showForm = false)} />
        {/if}

        <SortableList list={$userData?.links} on:sort={sortList} let:item>
            <div class="group relative">
                <UserLink editMode {...item} />
                <button
                    on:click={() => deleteLink(item)}
                    class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 -top-2"
                    >Delete</button
                >
            </div>
        </SortableList>
    {/if}
    <div class="text-center mb-8">
        <p>
            Profile Link:
            <a href={`/${$userData?.username}`} class="link link-accent">
                https://todo.change/{$userData?.username}
            </a>
        </p>
    </div>
</main>

<style>
    .customButton {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: width 0.25s ease 0.25s, border-radius 0.25s ease 0.25s,
            color 0.25s ease 0.5s;
    }

    .publishing,
    .published {
        width: 3rem;
        height: 3rem;
        border-radius: 9999px;
        overflow: hidden;
        color: rgba(0, 0, 0, 0);
        transition: color 0s, width 0.25s ease 0.25s,
            border-radius 0.25s ease 0.25s;
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
