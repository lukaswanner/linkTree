// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Error {
            message: string;
            data?: Record;
        }
        interface Locals {
            userID: string | null;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
