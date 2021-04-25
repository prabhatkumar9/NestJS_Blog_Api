import { UserRole } from "modals/user.modal";
import { BeforeInsert, Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class UserEntity {

    @ObjectIdColumn()
    _id: string;

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column({ unique: true })
    email: string

    @Column()
    profilePic: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}