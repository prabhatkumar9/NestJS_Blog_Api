import { Injectable } from '@nestjs/common';
import { IUser } from './user.model';
import { User, UserDocument } from './user.entity';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

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
                newUser._id = new mongoose.Types.ObjectId();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email.toLowerCase();
                newUser.profilePic = '';
                newUser.password = passHash;

                return from(this.userModel.create(newUser)).pipe(
                    map((resUser: IUser) => {
                        const { _id, name, username, profilePic, email } = resUser;
                        // console.log("user  :: ", _id, name, username, profilePic, email);
                        return { _id, name, username, profilePic, email };
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: string): Observable<IUser> {
        return from(this.userModel.findOne({ _id: id })).pipe(
            map((resUser: IUser) => {
                return resUser;
            }),
            catchError(err => throwError(err))
        )
    }

    findByEmail(email: string): Observable<IUser> {
        return from(this.userModel.findOne({ email: email }).select('username password email name role _id'));
    }

    findAll(page, take, search, sort): Observable<IUser[]> {
        if (search != '' && search != undefined) {
            let query = {
                $or: [
                    { name: new RegExp(search.toString(), 'i') },
                    { username: new RegExp(search.toString(), 'i') },
                    { email: new RegExp(search.toString(), 'i') },
                ]
            }

            return from(this.userModel.find(query).sort({ name: sort }).skip((page - 1) * take).limit(take));
        }
        else {
            return from(this.userModel.find().sort({ name: sort }).skip((page - 1) * take).limit(take));
        }
    }

    countDbDocs(search): Observable<number> {
        if (search) {
            let query = {
                $or: [
                    { name: new RegExp(search.toString(), 'i') },
                    { username: new RegExp(search.toString(), 'i') },
                    { email: new RegExp(search.toString(), 'i') },
                ]
            }
            return from(this.userModel.countDocuments(query));
        }
        else {
            return from(this.userModel.countDocuments());
        }
    }

    deleteOne(id: any): Observable<any> {
        return from(this.userModel.deleteOne({ _id: id }));
    }

    updateOne(id: any, user: IUser): Observable<any> {
        delete user.password;
        delete user.email;
        delete user.role;
        return from(this.userModel.updateOne({ _id: id }, user)).pipe(
            // tap(res => console.log('result :: ', res)),
            map(res => { if (res) return true }),
            catchError(err => { if (err) return throwError(false) })
        );
    }

    updateRoleOfUser(id: any, user: any): Observable<any> {
        return from(this.userModel.updateOne(id, user));
    }

    updateProfilePic(id: any, user: any): Observable<any> {
        // return from(this.userModel.update(id, user))
        return from(this.userModel.updateOne({ _id: id }, user))
    }


    /// ************************ ///
    // ---authentication funcs--- //
    login(user: IUser): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((usr: IUser) => {
                if (usr) {
                    return this.authService.generateJWT(usr).pipe(
                        map((token: string) => token)
                    )
                } else {
                    return 'Wrong credentials..!';
                }
            }),
            catchError(err => {
                return throwError('Wrong credentials..!');
            })
        )
    }

    validateUser(email: string, password: string): Observable<any> {
        return this.findByEmail(email).pipe(
            switchMap((user: IUser) => {
                // console.log(user);
                return this.authService.ComparePassword(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const { username, email, name, role, _id } = user;
                            return { username, email, name, role, _id };
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
