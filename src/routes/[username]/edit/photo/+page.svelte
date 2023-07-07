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
        if(!file){
            uploading = false;
            return;
        }
        previewURL = URL.createObjectURL(file);

        uploading = false;
    }
    async function upload() {
        uploading = true;
        if(!file){
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
    <main class="max-w-xl flex flex-col items-center mx-auto prose">
        <h1>Upload a new picture</h1>
        {#if $userData?.username == $page.params.username}
            <form class="max-w-screen-md w-full">
                <div
                    class="form-control flex flex-col items-center w-full mx-auto"
                >
                    <img
                        src={previewURL ?? $userData?.photoURL ?? "/user.png"}
                        alt="photoURL"
                        width="256"
                        height="256"
                    />
                    <label for="photoURL" class="label">
                        <span class="label-text">Pick a file</span>
                    </label>
                    <input
                        on:change={preview}
                        name="photoURL"
                        type="file"
                        class="file-input file-input-accent w-full"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                    />
                    {#if uploading}
                        <p class="mt-6">Uploading...</p>
                        <progress class="progress progress-info w-full mt-6" />
                    {/if}
                </div>
                <div class="flex flex-row gap-4 mt-8">
                    <button on:click={upload} class="btn btn-primary">
                        Upload
                    </button>
                    <a
                        href="/{$userData.username}/edit"
                        class="btn btn-outline"
                    >
                        Go Back
                    </a>
                </div>
            </form>
        {/if}
    </main>
</AuthCheck>
