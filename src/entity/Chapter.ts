import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Book } from "./Book";
import { Word } from "./Word";

@Entity()
export class Chapter{
    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column()
    name: String

    @Column({name: "wordCount"})
    wordCount: number

    @ManyToOne(type => Book, book => book.chapters)
    @JoinColumn({name: "bookId"})
    book: Book

    @ManyToMany(type => Word)
    @JoinTable({name:"chapter_word", joinColumn:{name: "chapterId"}, inverseJoinColumn:{name: "wordId"}})
    words: Word[]
}