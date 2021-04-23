
import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'modals/user.modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/user/user.service';
// import { hasRoles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // console.log(request);
        const user:User = request.user.user;
        // console.log(user._id);
        // return matchRoles(roles, user.roles);
        return this.userService.findOne(user._id).pipe(
            map((usr: User) => {
                // console.log('user found :: ', usr);
                const hasRole = () => roles.indexOf(usr.role) > -1
                let hasPermission: boolean = false;
                if (hasRole()) {
                    hasPermission = true;
                }
                return user && hasPermission;
                // return true;
            })
        )
        
    }
}
