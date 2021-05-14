
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';


export type BlogDocument = Blog & Document

@Schema({ timestamps: true })
export class Blog {

    @Prop()
    title: string;

    @Prop()
    slug: string;

    @Prop()
    description: string;

    @Prop()
    body: string;

    @Prop()
    likes: number;

    @Prop()
    headerImage: string

    @Prop()
    publishedAt: Date;

    @Prop()
    isPublished: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);