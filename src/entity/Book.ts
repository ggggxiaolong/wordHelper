import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Book{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    book_id: number

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
}