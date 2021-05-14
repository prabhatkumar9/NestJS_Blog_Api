import { Body, Controller, Get, Post } from '@nestjs/common';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponse } from 'src/auth/decorator/response.Object';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {

    constructor(private catService: CategoryService) { }

    @Post()
    create(@Body() body): Observable<IResponse> {
        return this.catService.createCategory(body.category_name).pipe(
            map(res => {
                let response: IResponse = {
                    success: true,
                    message: "category created...",
                    data: res
                }
                return response;
            }),
            catchError((err: any) => {
                let response: IResponse = {
                    success: false,
                    message: "some error Found",
                    data: err
                }
                // console.log(err);
                return of(response);
            })
        )
    }


    @Get()
    getAllCategory(): Observable<IResponse> {
        let count$ = this.catService.docsCount();
        let data$ = this.catService.getAllCategory();
        return from(forkJoin({ count: count$, data: data$ })).pipe(
            map((data) => {
                let response: IResponse = {
                    success: true,
                    message: "category list fetched...",
                    count: data.count,
                    data: data.data
                }
                return response;
            }),
            catchError((err: any) => {
                let response: IResponse = {
                    success: false,
                    message: "some cannot get all category",
                    data: err
                }
                // console.log(err);
                return of(response);
            })
        );
    }
}
