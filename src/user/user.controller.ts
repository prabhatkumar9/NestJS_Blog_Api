import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'modals/user.modal';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        // console.log(params);
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
