import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({name: "learn"})
export class Learn {
    @PrimaryColumn({name: "userId"})
    userId: number
    @PrimaryColumn({name: "bookId"})
    bookId: number
    @PrimaryColumn({name:"wordId"})
    wordId: number
    @Column({name: "createDate"})
    createDate: number
}