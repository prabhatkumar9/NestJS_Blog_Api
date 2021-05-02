import { Blog } from "src/blog/blog.model";
import { ObjectID } from 'typeorm'

export interface User {
    _id?: number;
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