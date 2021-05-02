import { User } from "src/user/user.model";
import { ObjectID } from 'typeorm'

export interface Blog {
    _id?: number;
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