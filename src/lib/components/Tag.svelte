<script lang="ts">
    import { db, user } from "$lib/firebase";
    import {
        arrayRemove,
        arrayUnion,
        doc,
        updateDoc,
    } from "firebase/firestore";
    import { writable } from "svelte/store";

    interface Tag {
        id: string;
        title: string;
    }

    export let tag: Tag;
    export let editMode: boolean = false;

    let editTag: HTMLDialogElement;

    const formData = writable({
        title: tag.title || "",
    });

    async function updateTag() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            tags: arrayUnion({ ...$formData, id: Date.now().toString() }),
        });

        await updateDoc(userRef, {
            tags: arrayRemove({
                title: tag.title,
                id: tag.id,
            }),
        });
    }

    async function deleteTag() {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            tags: arrayRemove({
                title: tag.title,
                id: tag.id,
            }),
        });
    }

    $: formIsValid = $formData.title.length > 0 && $formData.title.length <= 8;
</script>

{#if editMode}
    <div class="group relative">
        <button
            class="min-w-[5rem] min-h-[2rem] px-2 bg-[#A991F7] bg-opacity-50 border border-[#A991F7] rounded-full flex items-center justify-center"
            on:click={() => {
                editTag.showModal();
            }}
        >
            {tag.title}
        </button>
        <button
            on:click={() => {
                editTag.showModal();
            }}
            class="btn btn-xs btn-secondary invisible group-hover:visible absolute -right-6 -top-2"
            >Edit</button
        >
        <dialog bind:this={editTag} class="modal">
            <form method="dialog" class="modal-box">
                <h1 class="font-bold text-lg">Edit Tag</h1>
                <div class="flex flex-col items-start my-8">
                    <label for="title" class="label opacity-40">Title</label>
                    <input
                        name="title"
                        type="text"
                        placeholder="Creative"
                        class="input input-bordered"
                        bind:value={$formData.title}
                    />
                    {#if !formIsValid}
                        <p class="text-error text-xs mt-1">
                            Title must be between 1 & 8 characters long
                        </p>
                    {/if}
                </div>
                <div class="flex justify-between items-center">
                    <div class="modal-action justify-center">
                        <button
                            disabled={!formIsValid}
                            on:click={updateTag}
                            class="btn btn-success block">Save Tag</button
                        >

                        <button class="btn">Close</button>
                    </div>
                    <button
                        on:click={deleteTag}
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
            </form>
        </dialog>
    </div>
{:else}
    <div
        class="min-w-[5rem] min-h-[2rem] px-2 bg-[#A991F7] bg-opacity-50 border border-[#A991F7] rounded-full flex items-center justify-center"
    >
        {tag.title}
    </div>
{/if}
