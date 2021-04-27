import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { Blog } from './blog.model';

const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepo: Repository<BlogEntity>,
        private userService: UserService
    ) { }

    create(user: User, blog: Blog): Observable<Blog> {
        blog.author = user;
        return this.generateSlug(blog.title).pipe(
            switchMap((slug: string) => {
                blog.slug = slug;
                return from(this.blogRepo.save(blog));
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }

    findAll(): Observable<Blog[]> {
        return from(this.blogRepo.find({ relations: ['author'] }));
    }

    findByUserId(userId: string): Observable<Blog[]> {
        return from(this.blogRepo.find({
            where: { author: userId },
            relations: ['author']
        }));
    }

    findOneById(id: string): Observable<Blog> {
        return from(this.blogRepo.findOne(id, { relations: ['author'] }));
    }

}
