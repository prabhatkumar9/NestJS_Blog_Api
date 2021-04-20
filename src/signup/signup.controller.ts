import { Body, Controller, Post } from '@nestjs/common';
import { User } from './register.model';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {

    constructor(private signupService: SignupService) { }

    @Post()
    register(@Body() body) {
        console.log('Body ::: ', body);

        let user: User = {
            username: body.username,
            password: body.password,
            email: body.email,
            mobile: body.mobile
        }

        return this.signupService.registerUser(user);
    }

    @Post('/forgot')
    ForgotPw(@Body() body) {
        let email = body.email;
        let mobile = body.mobile;
        let query = {}
        if (email) {
            query['email'] = email;
        }
        else if (mobile) {
            query['mobile'] = mobile;
        } else {
            return 'Invalid INPUT';
        }

        return this.signupService.forgotPassword(query);
    }

    @Post('/reset')
    ChangePw(@Body() body) {
        let reset_Token = body.reset_token;
        let new_password = body.password;
        let confirm_password = body.confirm_password;
        this.signupService.changePassword(reset_Token, new_password, confirm_password);
    }
}
