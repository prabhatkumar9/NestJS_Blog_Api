import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query, Request } from '@nestjs/common';
import { User, UserRole } from 'modals/user.modal';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError((err) => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() body: User): Observable<any> {
        return this.userService.login(body).pipe(
            map((token: string) => {
                return { token }
            }),
            catchError((err) => of({ error: err.message }))
        );
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(
        @Query('page') page: number | string = 1,
        @Query('take') take: number | string = 10,
        @Query('search') search: string = '',
        @Query('sort') sort: string = 'asc',

    ): Observable<any> {
        let count$ = this.userService.countDbDocs();
        let data$ = this.userService.findAll(page, take, search, sort);
        return from(forkJoin({ count: count$, data: data$ }));
    }


    @Delete(':id')
    deleteOne(@Param('id') id: any): Observable<any> {
        return this.userService.deleteOne(id);
    }

    @Put(':id')
    UpdateOne(@Param('id') id: any, @Body() user: User): Observable<any> {
        return this.userService.updateOne(id, user);
    }

    @Put(':id/role')
    updateUserRole(@Param('id') id: any, @Body() body: any): Observable<any> {
        return this.userService.updateRoleOfUser(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadProfile')
    uploadFile(@Body() body, @Request() req): Observable<any> {
        // console.log(body);
        return this.userService.updateProfilePic(req._id, body.profilepic);
    }



}

//  {
    //     storage: diskStorage({
    //         destination: '../uploads/profileimages',
    //         filename: (res, file, cb) => {
    //             const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + 'fjs';
    //             const extnsn: string = path.parse(file.originalname).ext;
    //             cb(null, `${filename}${extnsn}`)
    //         }
    //     })
    // }