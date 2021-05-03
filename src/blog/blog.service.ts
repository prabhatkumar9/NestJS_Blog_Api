import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FindManyOptions, Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { Blog } from './blog.model';

const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepo: Repository<BlogEntity>,
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

    findAll(page, take, search, sort): Observable<Blog[]> {

        let options: any = {};

        if (search) {
            options = {
                where: {
                    title: new RegExp(search.toString(), 'i')
                }
            }
        }

        // if (sort) {
        //     options = {
        //         ...options,
        //         order: {
        //             title: sort.toString().toUpperCase()
        //         }
        //     }
        // }

        return from(this.blogRepo.find({
            ...options,
            relations: ["author"], take: 10,
            skip: (page - 1) * take
        }));
    }

    findByUserId(id: number, page, take, search, sort): Observable<Blog[]> {

        let options: FindManyOptions = {
            relations: ["author"],
            take: 10,
            skip: (page - 1) * take,
            where: { author: id }
        };

        if (search) {
            delete options.where
            options = {
                ...options, where: {
                    $or: [
                        { title: new RegExp(search.toString(), 'i') },
                        { slug: new RegExp(search.toString(), 'i') },
                        { description: new RegExp(search.toString(), 'i') },
                    ],
                    $and: [{ author: id }]
                }
            }
        }

        return from(this.blogRepo.find(options));
    }

    countDbDocs(search: string = '', userId: number = null): Observable<number> {
        let options: FindManyOptions = {};

        // if (userId != null && userId != undefined) {
        //     options = { where: { author: userId } }
        // }

        if (search != '' && search != undefined) {
            // delete options.where
            options = {
                ...options, where: {
                    $or: [
                        { title: new RegExp(search.toString(), 'i') },
                        { slug: new RegExp(search.toString(), 'i') },
                        { description: new RegExp(search.toString(), 'i') },
                    ],

                }
            }
        }

        return from(this.blogRepo.count())
    }

    findOneById(id: any): Observable<Blog> {
        return from(this.blogRepo.findOne(id, { relations: ['author'] }))
        // .pipe(
        //     tap(res => console.log(res))
        // )
    }

    updateOne(id, blog): Observable<Blog> {
        return from(this.blogRepo.update(id, blog)).pipe(
            switchMap(() => this.findOneById(id))
        )
    }

}
