import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name:'word'})
export class Word{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content_id: number

    @Column()
    audio: String

    @Column()
    pronunciation: String

    @Column()
    definition: String

    @Column()
    content: String
}