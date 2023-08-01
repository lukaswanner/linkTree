<script lang="ts">
    import ThemeSelect from "./ThemeSelect.svelte";
    import { auth } from "$lib/firebase";

    import { signOut } from "firebase/auth";

    export let username: string | null | undefined;
    export let photo: string | null | undefined;
    export let email: string | null | undefined;

    async function signOutSSR() {
        await fetch("/api/signin", { method: "DELETE" });
        await signOut(auth);
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="flex flex-row justify-between items-center pl-4 pr-4 pt-2 pb-2">
    <div class="flex flex-col">
        <a href="/" class="flex flex-row gap-2 items-center">
            <p class="hidden sm:block text-2xl font-bold">Lighthouse</p>
            <img src="/logo.png" class="h-12 w-12" alt="logo" />
        </a>
    </div>
    <div class="flex flex-row gap-4">
        <ThemeSelect />
        {#if username}
            <div
                tabindex="0"
                id="user-wrapper"
                class="transition-colors focus:text-primary-content hover:text-primary-content focus:bg-primary-focus hover:bg-primary-focus cursor-pointer dropdown dropdown-bottom dropdown-end flex flex-row items-center gap-4 p-2 rounded-lg"
            >
                <div class="avatar">
                    <div class="overflow-hidden w-10 rounded-full">
                        {#if photo}
                            <img alt="user profile" src={photo} />
                        {/if}
                    </div>
                </div>
                <div class="hidden md:flex flex-col min-w-[10ch]">
                    <p>{username}</p>
                    {#if email}
                        <p class="text-sm">{email}</p>
                    {/if}
                </div>
                <div id="arrow" class="flex items-center fill-current w-6 h-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                        /></svg
                    >
                </div>
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul
                    tabindex="0"
                    class="dropdown-content z-[1] text-base-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li>
                        <a href="/{username}">Your Profile</a>
                    </li>
                    <li>
                        <a href="/{username}/edit">Edit Profile</a>
                    </li>
                    <li>
                        <a on:click={signOutSSR} href="/">Logout</a>
                    </li>
                </ul>
            </div>
        {:else}
            <a href="/login" class="hidden sm:btn btn-neutral">Login</a>
            <a href="/signup" class="btn btn-primary">Sign Up</a>
        {/if}
    </div>
</div>

<style>
    #arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        transition-property: rotate;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 250ms;
    }
    #user-wrapper:focus #arrow,
    #user-wrapper:focus-within #arrow {
        rotate: 180deg;
    }
</style>
