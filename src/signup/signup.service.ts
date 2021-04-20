import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegDocument, User, Reg } from './register.model';

@Injectable()
export class SignupService {

    constructor(@InjectModel(Reg.name) private readonly RegisterUserModel: Model<RegDocument>) { }

    async registerUser(user: User): Promise<User> {
        // db call save;

        const createdUser = new this.RegisterUserModel(user);
        return createdUser.save();
    }

    async forgotPassword(query: {}) {
        // check in db and send reset link

        let user: any = await this.RegisterUserModel.findOne(query).exec();

        if (user) {
            console.log(user);
            return user;
        }
    }

    changePassword(token: string, npw: string, cpw: string) {
        // check token and accept new password
    }
}
