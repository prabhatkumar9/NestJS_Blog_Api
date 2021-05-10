import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from 'src/blog/blog.entity';
import { User, UserDocument } from 'src/user/user.entity';
import { IUser } from 'src/user/user.model';
import { ObjectId } from 'bson';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    generateJWT(user: IUser): Observable<string> {
        return from(this.jwtService.signAsync(user));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    ComparePassword(newPass: string, hashPass: string): Observable<any | boolean> {
        return from(bcrypt.compare(newPass, hashPass))
    }


    /// ********** users funcs ******************
    findUser(id: ObjectId): Observable<any> {
        return from(this.userModel.findOne({ _id: id }).select('username email name role _id')).pipe(
            map((resUser: IUser) => {
                return resUser;
            }),
            catchError(err => throwError(err))
        )
    }


    // *********** blogs funcs *******************
    findBlogById(id: any) {
        return from(this.blogModel.findOne({ _id: id }).populate({ path: 'author', select: ['name', 'email', 'username'] }));
    }


}
