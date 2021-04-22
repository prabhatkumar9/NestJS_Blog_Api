import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'modals/user.modal';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
                return {token}
            }),
            catchError((err) => of({ error: err.message }))
        );
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(id);
    }

    @Put(':id')
    UpdateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(id, user);
    }

}
