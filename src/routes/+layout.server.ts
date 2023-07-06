import type { LayoutServerLoad } from "./$types";
import { adminDB } from "$lib/server/admin";

export const load = (async ({ locals, cookies }) => {
    const db = await adminDB.collection("users").get();

    db.docs.forEach((data) => console.log(data.data().username));
    // Attach an asynchronous callback to read the data at our posts reference
    return { };
}) satisfies LayoutServerLoad;
