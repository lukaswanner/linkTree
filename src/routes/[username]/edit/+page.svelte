<script lang="ts">
    import { page } from "$app/stores";
    import AddLinkForm from "$lib/components/AddLinkForm.svelte";
    import SortableList from "$lib/components/SortableList.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import { arrayRemove, doc, setDoc, updateDoc } from "firebase/firestore";

    type Link = {
        icon: string;
        title: string;
        url: string;
        id: string;
    };

    let showForm = false;

    function sortList(e: CustomEvent) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
    }

    async function deleteLink(item: Link) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

    async function toggleProfileStatus() {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            published: !$userData?.published,
        });
    }

</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <div class="text-center mb-8">
            <p>
                Profile Link:
                <a href={`/${$userData?.username}`} class="link link-accent">
                    https://todo.change/{$userData?.username}
                </a>
            </p>
        </div>

        <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">
            @{$userData?.username}
        </h1>

        <img
            src={$userData.photoURL ?? "/user.png"}
            alt="photoURL"
            width="256"
            class="mx-auto rounded-full"
        />

        <div
            class="flex flex-row gap-4 items-center justify-center text-center my-4"
        >
            <a
                class="btn btn-outline flex-1"
                href={`/${$userData.username}/edit/bio`}>Edit Bio</a
            >
            <a
                on:click={() => void 0}
                href="/{$userData.username}/edit/photo"
                class="btn btn-outline flex-1"
            >
                Edit Picture
            </a>
        </div>

        <form class="form-control">
            <label class="label cursor-pointer flex flex-row items-start gap-4">
                <span class="label-text">
                    <div
                        class="tooltip group-hover:tooltip-open"
                        data-tip="If public, the world can see your profile"
                    >
                        {$userData?.published
                            ? "Public profile"
                            : "Private profile"}
                    </div>
                </span>
                <input
                    type="checkbox"
                    class="toggle toggle-success"
                    checked={$userData?.published}
                    on:change={toggleProfileStatus}
                />
            </label>
        </form>

        {#if !showForm}
            <button
                on:click={() => (showForm = true)}
                class="btn btn-outline btn-info block mx-auto my-4"
            >
                Add a Link
            </button>
        {:else}
            <AddLinkForm close={() => (showForm = false)} />
        {/if}

        <SortableList list={$userData?.links} on:sort={sortList} let:item>
            <div class="group relative">
                <UserLink editMode {...item}/>
                <button
                    on:click={() => deleteLink(item)}
                    class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 -top-2"
                    >Delete</button
                >
            </div>
        </SortableList>
    {/if}
</main>
