<script lang="ts">
    import AddLinkForm from "./AddLinkForm.svelte";

    let addLink: HTMLDialogElement;
    const title = "Add new link";
</script>

<button
    on:click={() => addLink.showModal()}
    class="stack w-[24rem] max-w-[85vw] text-center bg-white text-black flex justify-center items-center p-4 rounded-full"
>
    <span class="text-l font-bold">{title}</span>
</button>

<dialog bind:this={addLink} class="modal">
    <form method="dialog" class="modal-box">
        <AddLinkForm />
    </form>
</dialog>
