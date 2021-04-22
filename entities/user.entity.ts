import { BeforeInsert, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class UserEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column()
    email: string

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}