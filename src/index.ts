import "reflect-metadata";
import {createConnection} from "typeorm";
import { Book } from "./entity/Book";
import {jsonwebtoken} from "jsonwebtoken"
import { Word } from "./entity/Word";
import { from } from "apollo-link";
import { Chapter } from "./entity/Chapter";

createConnection().then(async connection => {

    // const books = await connection.manager.findOne(Book);
    // console.log("Loaded users: ", books);
    // const word = await connection.createQueryBuilder(Chapter, "chapter")
    //     .where("chapter.id = :id", {id:13718})
    //     .select("word")
    //     .leftJoinAndSelect("chapter.words", "word")
    // console.log(word)
    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
