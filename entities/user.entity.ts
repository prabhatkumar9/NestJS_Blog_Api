import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class UserEntity {

    @ObjectIdColumn()
    id:ObjectID;

    @Column()
    name: string

    @Column({ unique: true })
    username: string
}