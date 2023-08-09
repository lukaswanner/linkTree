<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import EditLinkForm from "$lib/components/EditLinkForm.svelte";
    import EditPostForm from "$lib/components/EditPostForm.svelte";
    import NewLink from "$lib/components/NewLink.svelte";
    import NewPost from "$lib/components/NewPost.svelte";
    import NewTag from "$lib/components/NewTag.svelte";
    import Post from "$lib/components/Post.svelte";
    import SortableList from "$lib/components/SortableList.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import UploadPhoto from "$lib/components/UploadPhoto.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import { doc, setDoc, updateDoc } from "firebase/firestore";
    import { scale } from "svelte/transition";

    type Link = {
        icon: string;
        title: string;
        url: string;
        id: string;
    };

    type Post = {
        title: string;
        content: string;
        date: Date;
        id: string;
    };

    let loading = false;
    let done = false;
    let currentItem: Link;
    let editLink: HTMLDialogElement;
    let currentPost: Post;
    let editPost: HTMLDialogElement;

    let links = true;
    let info = false;
    let photo = false;
    let tags = false;
    let posts = false;

    function copyLink() {
        navigator.clipboard.writeText(`localhost/${$userData?.username}`);
    }

    function sortList(e: CustomEvent) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
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
            }, 1000);
        }, 1000);
    }
</script>

<main
    class="flex flex-col gap-5 items-center text-center w-full max-w-lg mx-auto mt-8"
>
    {#if $userData?.username == $page.params.username}
        <img
            src={$userData.photoURL ?? "/user.png"}
            alt="photoURL"
            width="256"
            height="256"
            class="rounded-full"
        />
        <h1 class="text-4xl text-left">
            {$userData?.username}
        </h1>

        <div class="flex gap-4">
            <button
                class="btn btn-outline relative customButton rounded-lg w-[10ch]"
                class:publishing={loading}
                class:published={done}
                class:btn-success={$userData?.published}
                class:btn-error={!$userData?.published}
                on:click={toggleProfileStatus}
            >
                <p>
                    {$userData?.published ? "Public" : "Private"}
                </p>
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
                    >
                        <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                        />
                    </svg>
                </div>
            </button>

            <button on:click={copyLink} class="btn btn-outline rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path
                        d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
                    />
                </svg>
                <p>Copy link</p>
            </button>
        </div>

        <p class="base-content text-left">
            Manage your links, photo and publish your profile.
        </p>

        <div class="flex flex-row gap-5 mt-3">
            <button
                class="text-xl"
                on:click={() => {
                    links = true;
                    info = false;
                    photo = false;
                    tags = false;
                    posts = false;
                }}
                class:opacity-50={!links}>Links</button
            >
            <button
                class="text-xl"
                on:click={() => {
                    links = false;
                    info = true;
                    photo = false;
                    tags = false;
                    posts = false;
                }}
                class:opacity-50={!info}>Info</button
            >
            <button
                class="text-xl"
                on:click={() => {
                    links = false;
                    info = false;
                    photo = true;
                    tags = false;
                    posts = false;
                }}
                class:opacity-50={!photo}>Photo</button
            >
            <button
                class="text-xl"
                on:click={() => {
                    links = false;
                    info = false;
                    photo = false;
                    tags = true;
                    posts = false;
                }}
                class:opacity-50={!tags}>Tags</button
            >
            <button
                class="text-xl"
                on:click={() => {
                    links = false;
                    info = false;
                    photo = false;
                    tags = false;
                    posts = true;
                }}
                class:opacity-50={!posts}>Posts</button
            >
        </div>
        {#if links}
            <div
                in:scale={{ duration: 250, delay: 250 }}
                out:scale={{ duration: 250 }}
                class="flex flex-col items-center gap-4"
            >
                <NewLink />
                <div class="divider" />
                <SortableList
                    list={$userData?.links}
                    on:sort={sortList}
                    let:item
                >
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
                            class="btn btn-xs btn-secondary invisible group-hover:visible absolute -right-6 -top-2"
                            >Edit</button
                        >
                    </div>
                </SortableList>
            </div>
        {:else if info}
            <form
                in:scale={{ duration: 250, delay: 250 }}
                out:scale={{ duration: 250 }}
                method="POST"
                class="flex flex-col items-start gap-4 w-full"
                use:enhance
            >
                <div class="form-control w-full">
                    <label for="bio" class="label">
                        <span class="text-info">Your bio</span>
                    </label>
                    <textarea
                        name="bio"
                        class="textarea textarea-bordered textarea-lg"
                        value={$userData.bio}
                    />
                </div>
                <button class="btn">Update Bio</button>
                <p class="text-error">{$page.form?.problem ?? ""}</p>
            </form>
        {:else if photo}
            <div
                in:scale={{ duration: 250, delay: 250 }}
                out:scale={{ duration: 250 }}
            >
                <UploadPhoto />
            </div>
        {:else if tags}
            <div
                in:scale={{ duration: 250, delay: 250 }}
                out:scale={{ duration: 250 }}
                class="flex flex-col items-center justify-center gap-2"
            >
                <NewTag />
                {#if $userData.tags.length === 3}
                    <p class="text-2xl text-error">You can only have 3 tags!</p>
                {/if}

                <div class="divider" />

                {#if $userData.tags.length}
                    <div
                        class="flex flex-row items-center justify-center gap-5"
                    >
                        {#each $userData?.tags as tag}
                            <Tag {tag} editMode />
                        {/each}
                    </div>
                {:else}
                    <p class="text-2xl">It's empty here ☹</p>
                {/if}
            </div>
        {:else if posts}
            <div
                in:scale={{ duration: 250, delay: 250 }}
                out:scale={{ duration: 250 }}
                class="flex flex-col items-center justify-center gap-2"
            >
                <NewPost />

                <div class="divider" />

                {#if $userData?.posts && $userData?.posts.length}
                    <div
                        class="flex flex-col items-center justify-center gap-5"
                    >
                        {#each $userData?.posts.reverse() as post}
                            <div class="group relative">
                                <Post
                                    {...post}
                                    editMode
                                    openModal={() => {
                                        currentPost = post;
                                        console.log(currentPost);
                                        editPost.showModal();
                                    }}
                                />
                                <button
                                    on:click={() => {
                                        currentPost = post;
                                        console.log(currentPost);
                                        editPost.showModal();
                                    }}
                                    class="btn btn-xs btn-secondary invisible group-hover:visible absolute -right-6 -top-2"
                                    >Edit</button
                                >
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="text-2xl">It's empty here ☹</p>
                {/if}
            </div>
        {/if}

        <dialog bind:this={editLink} class="modal">
            <form method="dialog" class="modal-box">
                {#key currentItem}
                    {#if currentItem}
                        <EditLinkForm link={currentItem} />
                    {/if}
                {/key}
            </form>
        </dialog>
        <dialog bind:this={editPost} class="modal">
            <form method="dialog" class="modal-box">
                {#key currentPost}
                    {#if currentPost}
                        <EditPostForm post={currentPost} />
                    {/if}
                {/key}
            </form>
        </dialog>
    {/if}
</main>

<style>
    .customButton {
        display: flex;
        padding: 0px 4px;
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
