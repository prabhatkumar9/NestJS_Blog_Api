import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IBlog } from "src/blog/blog.model";
import { IUser } from "src/user/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthorGuard implements CanActivate {

    constructor(private authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user: IUser = request.user.user;
        const params = request.params;

        return this.authService.findUser(user._id).pipe(
            switchMap((usr: IUser) => {
                return this.authService.findBlogById(params.id).pipe(
                    map((blog: any) => {
                        let hasPermission: boolean = false;

                        if (blog.author._id.toString(2) == usr._id.toString()) {
                            hasPermission = true;
                            // console.log("yes there is true");
                        }
                        return usr && hasPermission;
                    })
                )
            })
        )

    }
}