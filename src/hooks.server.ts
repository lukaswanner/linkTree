import { adminAuth, adminDB } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";
import { themes } from "$lib/themes";

export const handle = (async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get("__session");
    const theme = event.cookies.get("theme");

    if (!sessionCookie && !theme) {
        return await resolve(event);
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie!
        );

        const uid = decodedClaims.uid;
        event.locals.uid = uid;
    } catch (e) {
        event.locals.uid = null;
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
