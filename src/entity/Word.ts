import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Chapter } from "./Chapter";

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

    @ManyToMany(type => Chapter)
    @JoinTable({name:"chapter_word"})
    chapters: Chapter[]
}