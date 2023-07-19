<script lang="ts">
    import EditLinkForm from "./EditLinkForm.svelte";

    export let icon = "custom";
    export let url = "foo";
    export let title = "some cool title";

    export let editMode = false;
    export let openModal: any;
</script>

{#if editMode}
    <button
        on:click={openModal}
        class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline"
    >
        <img src={`/${icon}.png`} alt={icon} class="w-6" />
        <span class="text-l font-bold">{title}</span>
    </button>
{:else}
    <a
        href={url}
        class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline"
    >
        <img src={`/${icon}.png`} alt={icon} class="w-6" />
        <span class="text-l font-bold">{title}</span>
    </a>
{/if}
