import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class UserIsUser implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user = request.user.user;
        // console.log(user);
        // console.log(params);
        let hasPermission: boolean = false;
        if (params.id === user._id) {
            hasPermission = true;
        }
        return user && hasPermission;
    }
}