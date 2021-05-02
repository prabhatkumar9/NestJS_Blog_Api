
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        // console.log(request);
        const user: User = request.user.user;
        return this.authService.findOne(user._id).pipe(
            map((usr: User) => {
                const hasRole = () => roles.indexOf(usr.role) > -1
                let hasPermission: boolean = false;
                if (hasRole()) {
                    hasPermission = true;
                }
                return user && hasPermission;
            })
        )

    }
}
