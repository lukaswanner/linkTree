<script lang="ts">
    import EditLinkForm from "./EditLinkForm.svelte";

    export let icon = "custom";
    export let url = "foo";
    export let title = "some cool title";
    export let id = '0';


    export let editMode = false;
    let editLink = false;
</script>

{#if editMode}
    <button
        on:click|preventDefault={()=> (editLink = !editLink)}
        class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline"
    >
        <img
            src={`/${icon}.png`}
            alt={icon}
            width="32"
            height="32"
            class="w-8"
        />
        <span class="text-l font-bold">{title}</span>
    </button>
            {#if editLink}
                <EditLinkForm {icon} {title} {url} {id} close={() => (editLink = false)} />
            {/if}
{:else}
    <a
        href={url}
        class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline"
    >
        <img
            src={`/${icon}.png`}
            alt={icon}
            width="32"
            height="32"
            class="w-8"
        />
        <span class="text-l font-bold">{title}</span>
    </a>
{/if}
