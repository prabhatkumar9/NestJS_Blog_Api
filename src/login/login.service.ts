import { Injectable } from '@nestjs/common';
import { Login } from './login.model';

@Injectable()
export class LoginService {

    loginUser(user: Login) {
        // logged in return token
    }
}
