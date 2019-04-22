import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Chapter } from "./Chapter";

@Entity({name:'book'})
export class Book{
    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column()
    name: String

    @Column()
    image: String
    
    @Column()
    word_count: number

    @Column()
    short_desc: String

    @Column()
    desc: String

    @OneToMany(type => Chapter, chapter => chapter.book)
    chapters: Chapter[];
}