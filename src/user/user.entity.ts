import { UserRole } from "src/user/user.model";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ObjectId } from "bson";


export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {

    // @Prop()
    // _id: ObjectId;

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

    @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
    role: UserRole

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
    blogEntries: ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);