import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';
import { from, Observable, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { catchError, map } from 'rxjs/operators';
import { BlogEntity } from 'src/blog/blog.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(BlogEntity) private readonly blogRepo: Repository<BlogEntity>
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
    findOne(id: any): Observable<User> {
        return from(this.userRepo.findOne(id)).pipe(
            map((resUser: User) => {
                const { password, ...result } = resUser;
                return result;
            }),
            catchError(err => throwError(err))
        )
    }

    // *********** blogs funcs *******************
    findBlogById(id: number) {
        return from(this.blogRepo.findOne(id));
    }


}
