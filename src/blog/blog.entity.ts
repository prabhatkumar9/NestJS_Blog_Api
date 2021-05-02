import { UserEntity } from "src/user/user.entity";
import { User } from "src/user/user.model";
import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn, PrimaryGeneratedColumn,ObjectID } from "typeorm";


@Entity('blog_entry')
export class BlogEntity {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @BeforeUpdate()
    updateTimeStamp() {
        this.updatedAt = new Date;
    }

    @Column({ default: 0 })
    likes: number;

    @Column({ default: 0 })
    headerImage: string

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    publishedAt: Date;

    @Column({ default: false })
    isPublished: boolean;

    @ManyToOne(type => UserEntity, user => user.blogEntries)
    author: User;
}