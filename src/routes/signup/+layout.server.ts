import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  if (locals.uid) {
    console.log(locals.uid);
    throw redirect(301, "/");
  }
  return {};
}) satisfies LayoutServerLoad;
