import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch("/api/auth", { method: "GET" });

    console.log(res.status);
    return {};
};
