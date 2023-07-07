// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
  interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    photoChanged: string;
    published: boolean;
    links: any[];
  }
  namespace App {
    interface Error {
      message: string;
      data?: Record;
    }
    interface Locals {
      uid: string | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
