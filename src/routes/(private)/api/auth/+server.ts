import { adminAuth } from "$lib/server/admin";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, cookies }) => {
    const { idToken } = await request.json();

    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    console.log("decdedIDTOKEn", decodedIdToken);
    return json({ status: "signedIn" });
};
