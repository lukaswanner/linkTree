<script lang="ts">
    import { page } from "$app/stores";
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { user, userData, storage, db } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let previewURL: string;
    let uploading = false;
    let file: Blob | null = null;

    async function preview(e: any) {
        uploading = true;
        file = e.target.files[0];
        if (!file) {
            uploading = false;
            return;
        }
        previewURL = URL.createObjectURL(file);

        uploading = false;
    }
    async function upload() {
        uploading = true;
        if (!file) {
            uploading = false;
            return;
        }
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
        uploading = false;
    }
</script>

<AuthCheck>
    <section>
        <h1 class="text-lg">Upload a new picture</h1>
        <div class="divider" />
        {#if $userData?.username == $page.params.username}
            <form>
                <div class="form-control items-center gap-4">
                    <img
                        src={previewURL ?? $userData?.photoURL ?? "/user.png"}
                        alt="photoURL"
                        width="256"
                        height="256"
                        class="rounded-full"
                    />
                    <input
                        on:change={preview}
                        name="photoURL"
                        type="file"
                        class="file-input"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                    />
                    {#if uploading}
                        <p class="mt-6">Uploading...</p>
                        <progress class="progress progress-info w-full mt-6" />
                    {/if}
                    <div class="divider" />
                    <button
                        disabled={!preview}
                        on:click={upload}
                        class="btn self-start"
                    >
                        Upload
                    </button>
                </div>
            </form>
        {/if}
    </section>
</AuthCheck>
