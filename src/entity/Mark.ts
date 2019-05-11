import { Entity, PrimaryColumn } from "typeorm";

@Entity({name:"mark"})
export class Mark{
    @PrimaryColumn({name:"userId"})
    userId: number

    @PrimaryColumn({name:"wordId"})
    wordId: number
}