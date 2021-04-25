import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities/user.entity';
import { User, UserRole } from 'modals/user.modal';
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
                newUser.role = UserRole.USER;

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

    findOne(id: any): Observable<User> {
        return from(this.userRepo.findOne(id)).pipe(
            map((resUser: User) => {
                // console.log(resUser);
                const { password, ...result } = resUser;
                return result;
            }),
            catchError(err => throwError(err))
        )
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepo.findOne({ email }));
    }

    findAll(page, take, search, sort): Observable<User[]> {

        let query = {};

        if (search) {
            query = {
                where: {
                    $or: [
                        { name: new RegExp(search.toString(), 'i') },
                        { username: new RegExp(search.toString(), 'i') },
                        { email: new RegExp(search.toString(), 'i') },
                    ]
                }
            }
        }

        if (sort) {
            query = {
                ...query,
                order: {
                    name: sort.toString().toUpperCase()
                }
            }
        }

        return from(this.userRepo.find({ ...query, take, skip: (page - 1) * take })).pipe(
            map((resUserArr: User[]) => {
                resUserArr.forEach(usr => delete usr.password);
                return resUserArr;
            }),
            catchError(err => throwError(err))
        )
    }

    countDbDocs(): Observable<any> {
        return from(this.userRepo.count())
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
        delete user.role;
        return from(this.userRepo.update(id, user));
    }

    updateRoleOfUser(id: any, body: any): Observable<any> {
        return from(this.userRepo.update(id, body));
    }

    updateProfilePic(id: string, profilePic: string): Observable<any> {
        return from(this.userRepo.update(id, { profilePic }))
        return from(this.userRepo.update(id, { "profilePic": profilePic })).pipe(
            map(res => {
                console.log(res);
                return res;
            })
        )
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
