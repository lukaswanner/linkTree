<script lang="ts">
    export let title: string;
    export let content: string;
    export let date: Date;
    export let editMode = false;
    export let openModal = () => void 0;
</script>

{#if editMode}
    <button
        on:click={openModal}
        class="flex flex-col gap-4 hover:border-[var(--pc)] border-2 border-white rounded-lg p-4 min-w-[350px] items-start"
    >
        <div class="flex flex-col items-start gap-1 w-full">
            <h2 class="text-4xl">{title}</h2>
            <p class="text-sm text-primary">
                {new Intl.DateTimeFormat(
                    Intl.DateTimeFormat().resolvedOptions().locale,
                    {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }
                ).format(date)}
            </p>
            <div class="divider m-0" />
        </div>
        <p>{content}</p>
    </button>
{:else}
    <div
        class="flex flex-col gap-4 border-2 border-white rounded-lg p-4 min-w-[350px] items-start"
    >
        <div class="flex flex-col items-start gap-1 w-full">
            <h2 class="text-4xl">{title}</h2>
            <p class="text-sm text-primary">
                {new Intl.DateTimeFormat(
                    Intl.DateTimeFormat().resolvedOptions().locale,
                    {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }
                ).format(date)}
            </p>
            <div class="divider m-0" />
        </div>
        <p>{content}</p>
    </div>
{/if}
