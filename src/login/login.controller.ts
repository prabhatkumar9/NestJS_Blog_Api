import { Body, Controller, Post } from '@nestjs/common';
import { Login } from './login.model';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

    constructor(private loginService: LoginService) { }

    @Post()
    login(@Body() body) {
        if (!body.email && !body.username) {
            return 'email or username not provided...!'
        } else {
            let user: Login = {
                username: body.username,
                password: body.password,
                email: body.email
            }

            this.loginService.loginUser(user)
        }
    }
}
