<script lang="ts">
    export let title: string;
    export let content: string;
    export let editMode = false;
    export let openModal = () => void 0;
</script>

{#if editMode}
    <button
        on:click={openModal}
        class="flex flex-col gap-4 hover:border-[var(--pc)] border-2 border-white rounded-lg p-4 min-w-[350px] items-start"
    >
        <h2 class="text-4xl">{title}</h2>
        <p>{content}</p>
    </button>
{:else}
    <div
        class="flex flex-col gap-4 border-2 border-white rounded-lg p-4 min-w-[350px] items-start"
    >
        <h2 class="text-4xl">{title}</h2>
        <p>{content}</p>
    </div>
{/if}
