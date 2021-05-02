import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { FindManyOptions, Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { Blog } from './blog.model';

const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepo: Repository<BlogEntity>,
        private userService: UserService
    ) { }

    create(user: any, blog: Blog): Observable<Blog> {
        delete user.iat
        delete user.exp
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
        const options: FindManyOptions = {
            relations: ["author"],
            take: 10
        };
        return from(this.blogRepo.find(options));
    }

    findByUserId(id: string): Observable<Blog[]> {
        return from(this.blogRepo.find());
    }

    findOneById(id: string): Observable<Blog> {
        return from(this.blogRepo.findOne(id, { relations: ['author'], select: ['author', 'body', '_id'] }))
            .pipe(
                tap(res => console.log(res))
            )
    }

    updateOne(id, blog): Observable<Blog> {
        return from(this.blogRepo.update(id, blog)).pipe(
            switchMap(() => this.findOneById(id))
        )
    }

}
