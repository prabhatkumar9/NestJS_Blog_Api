import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Blog } from "src/blog/blog.model";
import { BlogService } from "src/blog/blog.service";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";

export class UserIsAuthorGuard implements CanActivate {

    constructor(private userService: UserService, private blogService: BlogService) { }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const blogid = params.id;
        const req_user = request.user.user;

        return this.userService.findOne(req_user._id).pipe(
            switchMap((user: User) => this.blogService.findOneById(blogid).pipe(
                map((blog: Blog) => {
                    let hasPermission = false;

                    if (user._id === blog.author._id) {
                        hasPermission = true;
                    }

                    console.log("user :: ", user);
                    console.log("blog :: ", blog);

                    return user && hasPermission;
                })
            ))
        )
    }
}