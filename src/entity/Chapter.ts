import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Chapter{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chapter_id: number

    @Column()
    name: String

    @Column()
    word_count: number

    @Column()
    book_id: number
}