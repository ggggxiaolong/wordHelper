import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class WordInfo{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content_id: number

    @Column()
    audio: String

    @Column()
    pronumciation: String

    @Column()
    definition: String

    @Column()
    content: String
}