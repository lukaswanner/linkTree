<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import { user, userData } from "$lib/firebase";
    import "../../app.css";

    // preload global data that we use in child components
    $user;
    $userData;
</script>

<div class="flex flex-col h-full">
    <Navbar
        username={$userData?.username}
        email={$user?.email}
        photo={$userData?.photoURL}
    />
    <slot />
</div>
