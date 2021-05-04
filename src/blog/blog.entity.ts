
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.entity';

export type BlogDocument = Blog & Document

@Schema()
export class Blog {

    @Prop()
    _id: string;

    @Prop()
    title: string;

    @Prop()
    slug: string;

    @Prop()
    description: string;

    @Prop()
    body: string;

    @Prop({ type: 'timestamp', default: () => "CURRENT_TIME" })
    createdAt: Date;

    @Prop({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Prop()
    likes: number;

    @Prop()
    headerImage: string

    @Prop()
    publishedAt: Date;

    @Prop()
    isPublished: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);