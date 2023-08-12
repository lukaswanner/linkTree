<script lang="ts">
    import { page } from "$app/stores";
</script>

{#if $page.data?.uid}
    <slot />
{:else}
    <div class="flex flex-col gap-4 items-center">
        <h2 class="text-error text-2xl">
            You must be signed in to view this page.
        </h2>
        <a class="btn btn-primary w-fit" href="/signup">Sign Up</a>
    </div>
{/if}
