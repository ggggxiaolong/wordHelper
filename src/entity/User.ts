import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "username"})
    username: string;

    @Column({name: "nickname"})
    nickname: string;

    @Column({ name: 'mail'})
    mail: String;

    @Column({select: false})
    password: String

}
