import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Word{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: String

    @Column()
    definition: String

}