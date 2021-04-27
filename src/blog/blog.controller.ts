import { Body, Controller, Get, Post, Request, UseGuards, Query, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
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
        if (userId == null) {
            return this.blogService.findAll();
        } else {
            return this.blogService.findByUserId(userId);
        }

    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogService.findOneById(id);
    }
}
