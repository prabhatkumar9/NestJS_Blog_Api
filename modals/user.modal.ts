
// import { ObjectID } from "typeorm";

export interface User {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user',
}