import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put, Delete } from '@nestjs/common';
import { forkJoin, Observable, of, throwError } from 'rxjs';
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
                throwError(err);
                return of(response);
            })
        )
    }

    @Get()
    findBlogs(
        @Query('userId') userId: string,
        @Query('page') page: number | string = 1,
        @Query('take') take: number | string = 10,
        @Query('search') search: string,
        @Query('sort') sort: number = 1,
    ): Observable<IResponse> {
        let count$: Observable<number>;
        let blogs$: Observable<IBlog[]>;

        if (userId || search) {
            // console.log("with user id ", userId, search);
            count$ = this.blogService.countDbDocs(search, userId);
            blogs$ = this.blogService.findByUserId(userId, page, take, search, sort);
        }
        else {
            count$ = this.blogService.countDbDocs()
            blogs$ = this.blogService.findAll(page, take, search, sort)
        }

        return forkJoin({ count: count$, data: blogs$ }).pipe(
            map((data: any) => {
                let response: IResponse = {
                    success: true,
                    message: "list fetched successfully...",
                    count: data.count,
                    data: data.data,
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "list fetched failed...",
                    data: err
                }
                throwError(err);
                return of(response);
            })
        )
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IResponse> {
        // console.log("blog id  :: ", id);
        return this.blogService.findOneById(id).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "blog fetched successfully...",
                    data: res
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "blog not found...",
                    data: err
                }
                throwError(err)
                return of(response);
            })
        )
    }

    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() blog: IBlog): Observable<IResponse> {
        return this.blogService.updateOne(id, blog).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "blog updated successfully...",
                    data: res
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "blog not updated...",
                    data: err
                }
                throwError(err);
                return of(response);
            })
        )
    }

    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Delete(':id')
    deleteByID(@Param('id') id: string): Observable<IResponse> {
        return this.blogService.deleteByID(id).pipe(
            map(res => {
                // console.log(res);
                let response: IResponse = {
                    success: true,
                    message: "blog deleted successfully...",
                    data: res
                }
                return response;
            }),
            catchError(err => {
                let response: IResponse = {
                    success: false,
                    message: "blog not deleted...",
                    data: err
                }
                throwError(err)
                return of(response);
            })
        )
    }
}
