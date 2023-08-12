import type { LayoutServerLoad } from "./$types";

// get `locals.uid` and pass it to the `page` store
export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        uid: locals.uid,
    };
};
