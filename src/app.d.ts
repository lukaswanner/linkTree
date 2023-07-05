// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
    interface UserData {
        username: string;
        bio: string;
        photoURL: string;
        published: boolean;
        links: any[];
    }
    interface User extends UserData {
        uid: string;
    }
    namespace App {
        interface Error {
            message: string;
            data?: Record;
        }
        interface Locals {
            user: User | null;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
