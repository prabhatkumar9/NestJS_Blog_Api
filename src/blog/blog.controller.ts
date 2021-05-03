import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put } from '@nestjs/common';
import { forkJoin, from, Observable } from 'rxjs';
import { AuthorGuard } from 'src/auth/guards/author.guard';
import { JwtAuthGuard } from 'src/auth/guards/guard';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {

    constructor(private blogService: BlogService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blog: Blog, @Request() req) {
        const user = req.user.user;
        return this.blogService.create(user, blog);
    }

    @Get()
    findBlogs(
        @Query('userId') userId: string,
        @Query('page') page: number | string = 1,
        @Query('take') take: number | string = 10,
        @Query('search') search: string = '',
        @Query('sort') sort: string = 'asc',
    ): Observable<any> {
        let count$: Observable<number>;
        let blogs$: Observable<Blog[]>;
        if (userId == null) {
            count$ = this.blogService.countDbDocs();
            blogs$ = this.blogService.findAll(page, take, search, sort);
        } else {
            count$ = this.blogService.countDbDocs(search,Number(userId));
            blogs$ = this.blogService.findByUserId(Number(userId), page, take, search, sort);
        }

        return from(forkJoin({ count: count$, data: blogs$ }));
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<any> {
        console.log("blog id  :: ", id);
        return this.blogService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() blog: Blog): Observable<Blog> {
        return this.blogService.updateOne(id, blog);
    }
}
