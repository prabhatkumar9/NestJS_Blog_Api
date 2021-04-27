import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';
import { from, Observable } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    generateJWT(user: User): Observable<string> {
        return from(this.jwtService.signAsync(user));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    ComparePassword(newPass: string, hashPass: string): Observable<any | boolean> {
        return from(bcrypt.compare(newPass, hashPass))
    }
}
