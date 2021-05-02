import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Blog } from "src/blog/blog.model";
import { User } from "src/user/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthorGuard implements CanActivate {

    constructor(private authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user: User = request.user.user;
        const params = request.params;
        // console.log("params :: ", params);

        return this.authService.findUser(user._id).pipe(
            switchMap((usr: User) => {
                return this.authService.findBlogById(Number(params.id)).pipe(
                    map((blog: Blog) => {
                        // console.log(blog);
                        let hasPermission: boolean = false;

                        if (Number(blog.author._id) === Number(usr._id)) {
                            hasPermission = true;
                        }

                        return usr && hasPermission;
                    })
                )
            })
        )

    }
}