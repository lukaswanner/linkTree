import { userData as userDataStore } from "$lib/firebase";
import { get } from "svelte/store";
import { redirect } from "@sveltejs/kit";
import type { PageData } from "../$types";

export const load = (async () => {
  const userData = get(userDataStore);

  if (userData?.username) {
    throw redirect(301, `/${userData.username}`);
  }
  return {};
}) satisfies PageData;
