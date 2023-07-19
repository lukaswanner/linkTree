<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import { user, userData } from "$lib/firebase";
    import "../../app.css";

    // preload global data that we use in child components
    $user;
    $userData;
</script>

<Navbar
    username={$userData?.username}
    email={$user?.email}
    photo={$userData?.photoURL}
/>
<div class="min-h-screen flex flex-col">
    <slot />
</div>
