<script lang="ts">
    import { db, user, userData } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    let addTag: HTMLDialogElement;

    const formData = writable({
        title: "New Tag",
    });

    async function uploadTag() {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            tags: arrayUnion({ ...$formData, id: Date.now().toString() }),
        });
    }

    $: formIsValid = $formData.title.length > 0 && $formData.title.length <= 8;
</script>

<button
    disabled={$userData?.tags.length === 3}
    class="min-w-[5rem] min-h-[2rem] px-2 disabled:bg-gray-500 bg-[#A991F7] bg-opacity-50 enabled:border border-[#A991F7] rounded-full flex items-center justify-center"
    on:click={() => {
        addTag.showModal();
    }}
>
    Add new Tag
</button>
<dialog bind:this={addTag} class="modal">
    <form method="dialog" class="modal-box">
        <h1 class="font-bold text-lg">Add Tag</h1>
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
        <div class="modal-action justify-start">
            <button
                disabled={!formIsValid}
                on:click={uploadTag}
                class="btn btn-success block">Upload Tag</button
            >

            <button class="btn">Close</button>
        </div>
    </form>
</dialog>
