import { CanActivate, ExecutionContext, forwardRef, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Blog } from "src/blog/blog.model";
import { User } from "src/user/user.model";
import { AuthService } from "../auth.service";


export class UserIsAuthorGuard implements CanActivate {

    constructor(private authService: AuthService) { }

    canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const blogid = params.id;
        const req_userID = request.user.user._id;

        return this.authService.findOne(Number(req_userID)).pipe(
            switchMap((user: User) => this.authService.findBlogById(Number(blogid)).pipe(
                map((blog: Blog) => {
                    let hasPermission = false;

                    if (user._id === blog.author._id) {
                        hasPermission = true;
                    }
                    return user && hasPermission;
                })
            ))
        )







    }
}