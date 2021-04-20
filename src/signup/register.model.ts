export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
    mobile: string;
}



// schema mongodb
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegDocument = Reg & Document;

@Schema()
export class Reg {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    reset_token: string;
}

export const RegSchema = SchemaFactory.createForClass(Reg);