import "reflect-metadata";
import {createConnection} from "typeorm";
import {jsonwebtoken} from "jsonwebtoken"
import { ApolloServer, Request } from "apollo-server";
import { typeDef } from "./schema";
import { resolver } from "./resolvers";

const server = new ApolloServer({
    typeDefs: typeDef,
    resolvers: resolver,
    context: ({req}) =>{
        console.log(req.body.operationName)
    },
})

createConnection().then(async connection => {
    // console.log("Here you can setup and run express/koa/any other framework.");
    server.listen()
        .then(({url}) =>  console.log(`🚀 Server ready at ${url}`))
        .catch(err => console.log(err))
}).catch(error => console.log(error));
