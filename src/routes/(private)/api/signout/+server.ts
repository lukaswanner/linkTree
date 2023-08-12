import { json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete("__session", { path: "/" });
    return json({ status: "signedOut" });
};
