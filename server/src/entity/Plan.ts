import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({name:"plan"})
export class Plan{
    @PrimaryColumn({name:"bookId"})
    bookId: number

    @PrimaryColumn({name:"userId"})
    userId: number

    @Column({name:"wordId", default: 0})
    wordId: number

    @Column({name:"dailyWords"})
    dailyWord: number

    @Column({name:"createDate"})
    createDate: number
}