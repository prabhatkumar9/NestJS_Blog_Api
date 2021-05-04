import { ObjectId } from "bson";
import { IUser } from "src/user/user.model";

export interface IBlog {
    _id?: ObjectId;
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
    author?: ObjectId;
}