import { User } from "src/user/user.model";

export interface Blog {
    _id?: string;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    headerImage?: string
    publishedAt?: Date;
    isPublished?: boolean;
    author?: User;
}