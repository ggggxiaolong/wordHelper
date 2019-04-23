import "reflect-metadata";
import {createConnection} from "typeorm";
import { Book } from "./entity/Book";
import {jsonwebtoken} from "jsonwebtoken"

createConnection().then(async connection => {

    const users = await connection.manager.find(Book);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
