import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put } from '@nestjs/common';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponse } from 'src/auth/decorator/response.Object';
import { AuthorGuard } from 'src/auth/guards/author.guard';
import { JwtAuthGuard } from 'src/auth/guards/guard';
import { IUser } from 'src/user/user.model';
import { IBlog } from './blog.model';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {

    constructor(private blogService: BlogService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blog: IBlog, @Request() req): Observable<IResponse> {
        const user: IUser = req.user.user;
        // console.log("user :: ", user);
        return this.blogService.create(user._id, blog).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "Created Successfully...",
                    data: res,
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "Some error while saving blog...",
                    data: err,
                }
                return throwError(response)
            })
        )
    }

    @Get()
    findBlogs(
        @Query('userId') userId: string,
        @Query('page') page: number | string = 1,
        @Query('take') take: number | string = 10,
        @Query('search') search: string = '',
        @Query('sort') sort: number = 1,
    ): Observable<IResponse> {
        let count$: Observable<number>;
        let blogs$: Observable<IBlog[]>;

        if (userId == null && userId == '' && userId == undefined) {
            // console.log("without user id ");
            count$ = this.blogService.countDbDocs(search);
            blogs$ = this.blogService.findAll(page, take, search, sort);
        } else {
            // console.log("with user id ");
            count$ = this.blogService.countDbDocs(search, userId);
            blogs$ = this.blogService.findByUserId(userId, page, take, search, sort);
        }

        return forkJoin({ count: count$, data: blogs$ }).pipe(
            map((data: any) => {
                let response: IResponse = {
                    success: true,
                    message: "list fetched successfully...",
                    count: data.count,
                    data: data.data
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "list fetched failed...",
                    data: err
                }
                return throwError(response);
            })
        )
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<any> {
        console.log("blog id  :: ", id);
        return this.blogService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() blog: IBlog): Observable<IBlog> {
        return this.blogService.updateOne(id, blog);
    }
}
