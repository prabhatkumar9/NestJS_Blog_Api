import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from 'src/blog/blog.entity';
import { User, UserDocument } from 'src/user/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    generateJWT(user: User): Observable<string> {
        return from(this.jwtService.signAsync(user));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    ComparePassword(newPass: string, hashPass: string): Observable<any | boolean> {
        return from(bcrypt.compare(newPass, hashPass))
    }


    /// ********** users funcs ******************
    findUser(id: any): Observable<any> {
        console.log("id :::::::: ", id);
        return from(this.userModel.findOne(id)).pipe(
            map((resUser: User) => {
                const { password, ...result } = resUser;
                return result;
            }),
            catchError(err => throwError(err))
        )
    }


    // *********** blogs funcs *******************
    findBlogById(id: any) {
        return from(this.blogModel.findOne(id, { relations: ['author'] }));
    }


}
