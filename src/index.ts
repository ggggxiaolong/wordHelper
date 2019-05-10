import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as jwt from "jsonwebtoken"
import { ApolloServer } from "apollo-server";
import { typeDef } from "./schema";
import { resolver } from "./resolvers";
import * as depthLimit from "graphql-depth-limit" 
import { User } from "./entity/User";
import { AuthDirective } from "./control/AuthDirective";
import { JWTData } from "./entity/JWTData";


const server = new ApolloServer({
    typeDefs: typeDef,
    resolvers: resolver,
    context: async({req}) =>{
        // console.log(req.body.operationName)
        // console.log(req.body)
        const token = req.headers.token
        if(token){
            try{
                const data = <JWTData>jwt.verify(token, "secret")
                if(!data.isRefresh){
                    return {user: data.user}
                }
            } catch(e){
                console.log(`error token ${token}`)
            }
        }
    },
    validationRules:[depthLimit(5)],// 最多递归调用层数
    schemaDirectives: {
        auth: AuthDirective,
    }
})

createConnection().then(async connection => {
    // console.log("Here you can setup and run express/koa/any other framework.");
    server.listen()
        .then(({url}) =>  console.log(`🚀 Server ready at ${url}`))
        .catch(err => console.log(err))
}).catch(error => console.log(error));
