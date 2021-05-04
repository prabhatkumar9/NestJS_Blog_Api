import { UserRole } from "src/user/user.model";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Blog } from "src/blog/blog.entity";


export type UserDocument = User & Document

@Schema()
export class User {

    @Prop()
    _id: string;

    @Prop()
    name: string

    @Prop({ unique: true })
    username: string

    @Prop({ select: false })
    password: string

    @Prop({ unique: true })
    email: string

    @Prop()
    profilePic: string

    @Prop({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
    blogEntries: Blog[];

}

export const UserSchema = SchemaFactory.createForClass(User);