import { adminAuth, adminDB } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";
import { themes } from "$lib/themes";

export const handle = (async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get("__session");
    const theme = event.cookies.get("theme");

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie!
        );

        const uid = decodedClaims.uid;
        const userDoc = await adminDB.collection("users").doc(uid!).get();
        const { username, links, photoURL, bio, published } = userDoc.data()!;

        event.locals.user = {
            uid: uid,
            username,
            links,
            photoURL,
            bio,
            published,
        };
    } catch (e) {
        event.locals.user = null;
    } finally {
        if (!theme || !themes.includes(theme)) {
            return await resolve(event);
        }

        return await resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('data-theme=""', `data-theme="${theme}"`);
            },
        });
    }
}) satisfies Handle;
