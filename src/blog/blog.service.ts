import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IBlog } from './blog.model';
import { Blog, BlogDocument } from './blog.entity';
import { IUser } from 'src/user/user.model';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    create(user: IUser, blog: IBlog): Observable<BlogDocument> {
        blog.author = user._id;
        return this.generateSlug(blog.title).pipe(
            switchMap((slug: string) => {
                blog.slug = slug;
                return from(this.blogModel.create(blog));
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }

    findAll(page, take, search, sort): Observable<IBlog[]> {

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

        return from(this.blogModel.find({
            ...options,
            relations: ["author"], take: 10,
            skip: (page - 1) * take
        }));
    }

    findByUserId(id: number, page, take, search, sort): Observable<IBlog[]> {

        let options: any = {
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

        return from(this.blogModel.find(options));
    }

    countDbDocs(search: string = '', userId: number = null): Observable<number> {
        let options: any = {};

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

        return from(this.blogModel.count())
    }

    findOneById(id: any): Observable<IBlog> {
        return from(this.blogModel.findOne(id, { relations: ['author'] }))
        // .pipe(
        //     tap(res => console.log(res))
        // )
    }

    updateOne(id, blog: IBlog): Observable<IBlog> {
        return from(this.blogModel.updateOne(id, blog)).pipe(
            switchMap(() => this.findOneById(id))
        )
    }

}
