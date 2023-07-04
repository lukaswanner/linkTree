// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
    interface User {
        uid: string | null;
        username: string | null;
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
