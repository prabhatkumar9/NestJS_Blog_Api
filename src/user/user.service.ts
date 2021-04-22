import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities/user.entity';
import { User } from 'modals/user.modal';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        private authService: AuthService
    ) { }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passHash;

                return from(this.userRepo.save(newUser)).pipe(
                    map((resUser: User) => {
                        const { password, ...result } = resUser;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: string): Observable<User> {
        return from(this.userRepo.findOne({ id })).pipe(
            map((resUser: User) => {
                const { password, ...result } = resUser;
                return result;
            }),
            catchError(err => throwError(err))
        )
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepo.findOne({ email }));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepo.find()).pipe(
            map((resUserArr: User[]) => {
                resUserArr.forEach(usr => delete usr.password);
                return resUserArr;
            }),
            catchError(err => throwError(err))
        )
    }

    deleteOne(id: string): Observable<any> {
        return from(this.userRepo.delete(id)).pipe(
            map(result => {
                if (result) {
                    return { message: 'deleted', 'success': true }
                } else {
                    return { message: 'error', 'success': false }
                }
            })
        )
    }

    updateOne(id: string, user: User): Observable<any> {
        delete user.password;
        delete user.email;
        return from(this.userRepo.update(id, user));
    }



    /// ************************ ///
    // ---authentication funcs--- //
    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((usr: User) => {
                if (usr) {
                    return this.authService.generateJWT(usr).pipe(
                        map((token: string) => token)
                    )
                } else {
                    return 'Wrong credentials..!'
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<any> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => {
                return this.authService.ComparePassword(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const { password, ...result } = user;
                            return result;
                        } else {
                            throw Error;
                        }
                    })
                )
            })
        )
    }
    /// ************************ ///

}
