<script lang="ts">
    import { user, userData } from "$lib/firebase";
    import "../app.css";

    // preload global data that we use in child components
    $user;
    $userData;
</script>

<div class="min-h-screen flex flex-col">
    <slot />
</div>
