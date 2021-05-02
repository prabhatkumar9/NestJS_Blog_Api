import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/guard';
import { UserIsAuthorGuard } from 'src/auth/guards/userIsAuthor.guard';
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
    findBlogs(@Query('userId') userId: string): Observable<Blog[]> {
        console.log("userId id  :: ", userId);
        if (userId == null) {
            return this.blogService.findAll();
        } else {
            return this.blogService.findByUserId(userId);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string):Observable<any> {
        console.log("blog id  :: ", id);
        return this.blogService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() blog: Blog): Observable<Blog> {
        return this.blogService.updateOne(id, blog);
    }
}
