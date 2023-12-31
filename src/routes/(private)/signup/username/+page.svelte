<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db, user, userData } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    async function checkAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);

        loading = true;
        debounceTimer = setTimeout(async () => {
            const ref = doc(db, "usernames", username);
            const exists = await getDoc(ref).then((doc) => doc.exists());

            isAvailable = !exists;
            loading = false;
        }, 500);
    }

    async function confirmUsername() {
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        batch.set(doc(db, "users", $user!.uid), {
            username,
            photoURL: $user?.photoURL ?? null,
            photoChanged: false,
            published: true,
            bio: "I am the Walrus",
            links: [
                {
                    title: "Test Link",
                    url: "https://google.com",
                    icon: "custom",
                },
            ],
            tags: [
                {
                    title: "Tag #1",
                },
                {
                    title: "Tag #2",
                },
                {
                    title: "Tag #3",
                },
            ],
            posts: [],
        });

        await batch.commit();
    }

    const re = /^(?=[a-zA-Z0-9._]{2,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    $: isValid =
        username?.length > 1 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;
</script>

<AuthCheck>
    {#if $userData?.username}
        <p class="text-lg">
            Your username is <span class="text-success font-bold"
                >@{$userData.username}</span
            >
        </p>
        <p class="text-sm">(Usernames cannot be changed)</p>
        <a class="btn btn-primary" href="/signup/photo">Upload Profile Image</a>
    {:else}
        <h2 class="text-4xl mb-4">Choose Username</h2>
        <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
            <input
                type="text"
                placeholder="Username"
                class="input w-full"
                bind:value={username}
                on:input={checkAvailability}
                class:input-error={!isValid && isTouched}
                class:input-warning={isTaken}
                class:input-success={isAvailable && isValid && !loading}
            />

            <div class="my-6 px-8 w-full">
                {#if loading}
                    <p class="text-secondary">
                        Checking availabilty of @{username}...
                    </p>
                {/if}

                {#if !isValid && isTouched}
                    <p class="text-error text-sm">
                        must be 2-16 characters long, alphanumeric only
                    </p>
                {/if}

                {#if isValid && !isAvailable && !loading}
                    <p class="text-warning text-sm">
                        @{username} is not available
                    </p>
                {/if}
            </div>

            {#if isValid && isAvailable}
                <button class="btn btn-success"
                    >Confirm username @{username}</button
                >
            {/if}
        </form>
    {/if}
</AuthCheck>
