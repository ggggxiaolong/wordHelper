import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity({name:'word'})
export class Word{
    @PrimaryColumn()
    id: number

    @Column()
    audio: String

    @Column()
    pronunciation: String

    @Column()
    definition: String

    @Column()
    content: String
}