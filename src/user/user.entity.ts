import { UserRole } from "src/user/user.model";
import { BlogEntity } from "src/blog/blog.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ObjectIdColumn, OneToMany, PrimaryColumn ,ObjectID, PrimaryGeneratedColumn} from "typeorm";
import { Blog } from "src/blog/blog.model";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column({ select: false })
    password: string

    @Column({ unique: true })
    email: string

    @Column()
    profilePic: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @OneToMany(type => BlogEntity, blog => blog.author, { lazy: true })
    @JoinColumn()
    blogEntries: Blog[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}