// import { IBlog } from "src/blog/blog.model";

import { ObjectId } from "bson";

export interface IUser {
    _id?: ObjectId;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profilePic?: string;
    blogEntries?: ObjectId[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user',
}