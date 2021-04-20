import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities/user.entity';
import { User } from 'modals/user.modal';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) { }

    create(user: User): Observable<User> {
        return from(this.userRepo.save(user));
    }

    findOne(id: string): Observable<User> {
        return from(this.userRepo.findOne(id ));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepo.find());
    }

    deleteOne(id: string): Observable<any> {
        return from(this.userRepo.delete(id));
    }

    updateOne(id: string, user: User): Observable<any> {
        return from(this.userRepo.update(id, user));
    }
}
