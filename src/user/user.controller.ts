import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query, Request } from '@nestjs/common';
import { IUser, UserRole } from 'src/user/user.model';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserIsUser } from 'src/auth/guards/userIsUser.guard';
import { UserService } from './user.service';
import { IResponse } from 'src/auth/decorator/response.Object';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: IUser): Observable<IResponse> {
        return this.userService.create(user)
            .pipe(
                map((user: IUser) => {
                    let response: IResponse = {
                        success: true,
                        message: "User regsitered",
                        data: user
                    }
                    return response;
                }),
                catchError((err: any) => {
                    let response: IResponse = {
                        success: false,
                        message: "Duplicate Key Found",
                    }

                    if (err.keyPattern.email) {
                        response.message = `email already exist ${err.keyValue.email}`
                    }
                    // console.log(err);
                    return of(response);
                })
            )
    }

    @Post('login')
    login(@Body() body: IUser): Observable<IResponse> {
        return this.userService.login(body).pipe(
            map((token: string) => {
                let response: IResponse = {
                    success: true,
                    message: "login successfull..!",
                    data: { token }
                }
                return response;
            }),
            catchError((err) => {
                let response: IResponse = {
                    success: false,
                    message: `${err}`,
                }
                return of(response);
            })
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    findOne(@Param() params): Observable<IResponse> {
        return this.userService.findOne(params.id).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "user found...",
                    data: res
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "user not found..!" + err,
                }
                return throwError(response);
            })
        )
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(
        @Query('page') page: number | string = 1,
        @Query('take') take: number | string = 10,
        @Query('search') search: string = '',
        @Query('sort') sort: number = 1,

    ): Observable<IResponse> {
        let count$ = this.userService.countDbDocs(search);
        let data$ = this.userService.findAll(page, take, search, sort);
        return from(forkJoin({ count: count$, data: data$ })).pipe(
            map((data) => {
                let response: IResponse = {
                    success: true,
                    message: "user list found...",
                    count: data.count,
                    data: data.data
                }
                return response;
            }),
            catchError((err: any) => {
                let response: IResponse = {
                    success: false,
                    message: "some error Found",
                    data: err
                }
                // console.log(err);
                return of(response);
            })
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: any): Observable<IResponse> {
        return this.userService.deleteOne(id).pipe(
            map(usr => {
                let response: IResponse = {
                    success: true,
                    message: "user deleted successfully !",
                    data: usr,
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "some error occurred",
                    data: err,
                }
                return throwError(response);
            })
        )
    }

    @UseGuards(JwtAuthGuard, UserIsUser)
    @Put(':id')
    UpdateOne(@Param('id') id: any, @Body() user: IUser): Observable<IResponse> {
        return this.userService.updateOne(id, user).pipe(
            map(res => {
                let response: IResponse = {
                    message: 'updated successfully !',
                    success: true,
                    data: res
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    message: 'updation failed  !',
                    success: false,
                    data: err
                }
                return of(response);
            })
        )
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateUserRole(@Param('id') id: any, @Body() body: any): Observable<IResponse> {
        return this.userService.updateRoleOfUser(id, body).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "role updated successfully...",
                    data: res,
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "some error occurred",
                    data: err,
                }
                return throwError(response);
            })
        )
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadProfile')
    uploadFile(@Body() user: IUser, @Request() req): Observable<IResponse> {
        return this.userService.updateProfilePic(req.user.user._id, user).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "profile updated successfully...",
                    data: res,
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "some error occurred",
                    data: err,
                }
                return throwError(response);
            })
        )
    }

}

//  {
//     storage: diskStorage({
//         destination: '../uploads/profileimages',
//         filename: (res, file, cb) => {
//             const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + 'fjs';
//             const extnsn: string = path.parse(file.originalname).ext;
//             cb(null, `${ filename }${ extnsn }`)
//         }
//     })
// }