// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

type Post = {
    title: string;
    content: string;
    date: Date;
    id: string;
};
type Link = {
    icon: string;
    title: string;
    url: string;
    id: string;
};
declare global {
    interface UserData {
        username: string;
        bio: string;
        photoURL: string;
        photoChanged: string;
        published: boolean;
        links: Link[];
        tags: any[];
        posts: Post[];
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
