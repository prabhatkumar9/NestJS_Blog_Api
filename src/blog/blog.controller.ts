import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
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
    findBlogs(@Query('userId') userId: string): Observable<Blog[]> {
        // console.log("userId id  :: ", userId);
        if (userId == null) {
            return this.blogService.findAll();
        } else {
            // console.log("else part");
            return this.blogService.findByUserId(Number(userId));
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<any> {
        console.log("blog id  :: ", id);
        return this.blogService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard,AuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() blog: Blog): Observable<Blog> {
        return this.blogService.updateOne(id, blog);
    }
}
