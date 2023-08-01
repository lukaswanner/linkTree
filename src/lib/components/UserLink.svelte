<script lang="ts">
    import EditLinkForm from "./EditLinkForm.svelte";

    export let icon = "custom";
    export let url = "foo";
    export let title = "some cool title";

    export let editMode = false;
    export let openModal = void 0;
</script>

{#if editMode}
    <button
        on:click={openModal}
        class="stack w-[24rem] max-w-[85vw] text-center hover:outline outline-[var(--pc)] bg-white text-black flex justify-center items-center p-4 rounded-full"
    >
        <img src={`/${icon}.png`} alt={icon} class="w-6" />
        <span class="text-l font-bold">{title}</span>
    </button>
{:else}
    <a
        href={url}
        class="stack w-[24rem] max-w-[85vw] text-center hover:outline outline-[var(--pc)] bg-white text-black flex justify-center items-center p-4 rounded-full no-underline"
    >
        <img src={`/${icon}.png`} alt={icon} class="w-6" />
        <span class="text-l font-bold">{title}</span>
    </a>
{/if}
