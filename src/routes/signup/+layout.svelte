<script lang="ts">
    import { page } from "$app/stores";
    import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
</script>

<nav class="flex justify-center my-6">
    <ul class="steps">
        <a
            href="/signup"
            class="step transition-all step-primary after:transition-all"
            >Sign In</a
        >
        <a
            href="/signup/username"
            class="step transition-all after:transition-all"
            class:step-primary={$page.route.id?.match(/username|photo/g)}
            >Choose Username</a
        >
        <a
            href="/signup/photo"
            class="step transition-all after:transition-all"
            class:step-primary={$page.route.id?.match(/photo/g)}
            >Upload Photo</a
        >
    </ul>
</nav>

<AnimatedRoute>
    <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
        <div class="card-body items-center text-center">
            <slot />
        </div>
    </main>
</AnimatedRoute>
