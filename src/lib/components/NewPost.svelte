<script lang="ts">
    import { db, user, userData } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    let addPost: HTMLDialogElement;
    const title = "Add new Post";

    const formData = writable({
        title: "New Post",
        content: "I've got a lot to tell...",
    });

    async function uploadPost() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            posts: arrayUnion({
                ...$formData,
                date: Date.now(),
                id: Date.now().toString(),
            }),
        });
    }

    $: titleIsValid =
        $formData.title.length > 0 && $formData.title.length <= 24;
    $: contentIsValid =
        $formData.content.length > 0 && $formData.title.length <= 255;
    $: formIsValid = titleIsValid && contentIsValid;
</script>

<button
    on:click={() => {
        addPost.showModal();
    }}
    class="stack w-[24rem] max-w-[85vw] text-center bg-white text-black flex justify-center items-center p-4 rounded-full"
>
    <span class="text-l font-bold">{title}</span>
</button>

<dialog bind:this={addPost} class="modal">
    <form method="dialog" class="modal-box">
        <div class="flex flex-col gap-4">
            <h1 class="font-bold text-lg">Add Post</h1>
            <div class="flex flex-col items-start">
                <label for="title" class="label opacity-40">Title</label>
                <input
                    name="title"
                    type="text"
                    placeholder="Creative"
                    class="input input-bordered w-full"
                    bind:value={$formData.title}
                />
                {#if !titleIsValid}
                    <p class="text-error text-xs mt-1">
                        Title must be between 1 & 24 characters long
                    </p>
                {/if}
            </div>
            <div class="flex flex-col items-start">
                <label for="content" class="label">
                    <span class="text-info">Tell us what you think</span>
                </label>
                <textarea
                    name="content"
                    class="textarea textarea-bordered textarea-lg w-full"
                    bind:value={$formData.content}
                />
                {#if !contentIsValid}
                    <p class="text-error text-xs mt-1">
                        Post must be between 1 & 255 characters long
                    </p>
                {/if}
            </div>
            <div class="modal-action justify-start">
                <button
                    disabled={!formIsValid}
                    on:click={uploadPost}
                    class="btn btn-success block">Upload Post</button
                >

                <button class="btn">Close</button>
            </div>
        </div>
    </form>
</dialog>
