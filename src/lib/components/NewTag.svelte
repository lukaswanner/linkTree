<script lang="ts">
    import { db, user, userData } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    let addTag: HTMLDialogElement;
    const title = "Add new link";

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
    on:click={() => {
        addTag.showModal();
    }}
    disabled={$userData?.tags.length === 3}
    class="stack w-[24rem] disabled:opacity-25 max-w-[85vw] text-center bg-white text-black flex justify-center items-center p-4 rounded-full"
>
    <span class="text-l font-bold">{title}</span>
</button>

<dialog bind:this={addTag} class="modal">
    <form method="dialog" class="modal-box">
        <div class="flex flex-col gap-4">
            <h1 class="font-bold text-lg">Add Tag</h1>
            <div class="flex flex-col items-start">
                <label for="title" class="label opacity-40">Title</label>
                <input
                    name="title"
                    type="text"
                    placeholder="Creative"
                    class="input input-bordered w-full"
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
        </div>
    </form>
</dialog>
