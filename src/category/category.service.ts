import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';
import * as mongoose from 'mongoose';
import { from, Observable } from 'rxjs';

@Injectable()
export class CategoryService {

    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) { }

    createCategory(category: string): Observable<any> {
        let cat = new this.categoryModel();
        cat._id = new mongoose.Types.ObjectId();
        cat.name = category;
        return from(this.categoryModel.create(cat))
    }

    getAllCategory(): Observable<any> {
        return from(this.categoryModel.find())
    }

    docsCount(): Observable<any> {
        return from(this.categoryModel.countDocuments())
    }
}
