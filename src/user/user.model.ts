import { Blog } from "src/blog/blog.model";

export interface User {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profilePic?: string;
    blogEntries?: Blog[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user',
}