import { Injectable } from '@nestjs/common';
import { IUser, UserRole } from './user.model';
import { User, UserDocument } from './user.entity';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private authService: AuthService
    ) { }

    create(user: IUser): Observable<IUser> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passHash: string) => {
                const newUser = new this.userModel();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.profilePic = '';
                newUser.password = passHash;
                newUser.role = UserRole.USER;

                return from(this.userModel.create(newUser)).pipe(
                    map((resUser: IUser) => {
                        const { password, ...result } = resUser;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: any): Observable<any> {
        return from(this.userModel.findOne(id)).pipe(
            map((resUser: User) => {
                const { password, ...result } = resUser;
                return result;
            }),
            catchError(err => throwError(err))
        )
    }

    findByEmail(email: string): Observable<UserDocument> {
        return from(this.userModel.findOne({ where: { email }, select: ['password', 'username', 'email', 'name', 'role', '_id', 'profilePic'] }));
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

        return from(this.userModel.find({ ...query, take, skip: (page - 1) * take, relations: ['blogEntries'] })).pipe(
            map((resUserArr: User[]) => {
                resUserArr.forEach(usr => delete usr.password);
                return resUserArr;
            }),
            catchError(err => throwError(err))
        )
    }

    countDbDocs(search): Observable<any> {
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
        };

        return from(this.userModel.count(query));
    }


    deleteOne(id: any): Observable<any> {
        return from(this.userModel.deleteOne(id)).pipe(
            map(result => {
                if (result) {
                    return { message: 'deleted', 'success': true }
                } else {
                    return { message: 'error', 'success': false }
                }
            })
        )
    }

    updateOne(id: any, user: any): Observable<any> {
        delete user.password;
        delete user.email;
        delete user.role;
        return from(this.userModel.updateOne(id, user));
    }

    updateRoleOfUser(id: any, user: any): Observable<any> {
        return from(this.userModel.updateOne(id, user));
    }

    updateProfilePic(id: any, user: any): Observable<any> {
        // return from(this.userModel.update(id, user))
        return from(this.userModel.updateOne(id, user)).pipe(
            map(res => {
                if (res) {
                    return { success: true, message: 'profile updated successfully !' }
                } else {
                    return { success: false, message: 'something went wrong !' }
                }
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
                // console.log(user);
                return this.authService.ComparePassword(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const { password, profilePic, ...result } = user;
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
