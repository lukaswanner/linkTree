import { adminAuth, adminDB } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get("__session");

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie!
        );

        const uid = decodedClaims.uid;
        const userDoc = await adminDB.collection("users").doc(uid!).get();
        const { username } = userDoc.data()!;

        event.locals.user = {
            uid: uid,
            username,
        };
    } catch (e) {
        event.locals.user = null;
        return resolve(event);
    }

    return resolve(event);
}) satisfies Handle;
