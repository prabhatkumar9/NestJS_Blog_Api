import { UserRole } from "src/user/user.model";
import { BlogEntity } from "src/blog/blog.entity";
import { BeforeInsert, Column, Entity, ObjectIdColumn, OneToMany } from "typeorm";

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

    @OneToMany(type => BlogEntity, blog => blog.author)
    blogEntries: BlogEntity[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}