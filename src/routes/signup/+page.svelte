<script lang="ts">
    import { auth, user, userData } from "$lib/firebase";

    import {
        GoogleAuthProvider,
        signInWithPopup,
    } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);

        const idToken = await credential.user.getIdToken();

        await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
        });
    }

</script>

<h2 class="text-4xl mb-4">Sign Up</h2>

{#if $user}
    <h2 class="card-title">Welcome, {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in</p>
    {#if !$userData}
    <a href="/signup/username"class="btn btn-warning mt-8">Create Username</a>
    {/if}
{:else}
    <button class="btn btn-primary" on:click={signInWithGoogle}
        >Sign Up with Google
    </button>
{/if}
