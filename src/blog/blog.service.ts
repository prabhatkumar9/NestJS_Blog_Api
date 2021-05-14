import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IBlog } from './blog.model';
import { Blog, BlogDocument } from './blog.entity';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    create(user_id: any, blog: IBlog): Observable<IBlog> {
        blog.author = user_id;
        // category will already come with blog body
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

    findAll(page, take, search, sort): Observable<any> {
        let options: any = {};
        if (search != '' && search != undefined) {
            options = {
                $or: [{ title: new RegExp(search.toString(), 'i') }]
            }

            return from(this.blogModel.find(options).sort({ createdAt: sort }).skip((page - 1) * take).limit(take));
        } else {
            return from(this.blogModel.find().sort({ createdAt: sort }).skip((page - 1) * take).limit(take));
        }

    }

    findByUserId(id: string, page, take, search, sort): Observable<IBlog[]> {
        let options: any = {};

        if (id != null && id != undefined && id != '') {
            options = { author: id }
        }

        if (search != '' && search != undefined) {
            options = {
                ...options,
                $or: [{ title: new RegExp(search.toString(), 'i') }]
            }
        }

        return from(this.blogModel.find(options).sort({ createdAt: sort }).skip((page - 1) * take).limit(take).populate({ path: 'author', select: ['name', 'email', 'username'] }))
    }

    countDbDocs(search: string = '', userId: any = ''): Observable<number> {
        if (search || userId) {
            let options: any = {};
            if (userId != null && userId != undefined) {
                options = { author: userId }
            }

            if (search != '' && search != undefined) {
                options = { $or: [{ title: new RegExp(search.toString(), 'i') }] }
            }

            return from(this.blogModel.countDocuments(options));
        } else {
            return from(this.blogModel.countDocuments());
        }
    }

    findOneById(id: string): Observable<IBlog> {
        return from(this.blogModel.findOne({ _id: id }).populate({ path: 'author', select: ['name', 'email', 'username'] }))
    }

    updateOne(id, blog: IBlog): Observable<IBlog> {
        return from(this.blogModel.updateOne({ _id: id }, blog)).pipe(
            switchMap(() => this.findOneById(id))
        )
    }

    deleteByID(id: string) {
        return from(this.blogModel.deleteOne({ _id: id }));
    }

}
