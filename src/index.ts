import "reflect-metadata";
import {createConnection, getRepository} from "typeorm"
import * as jwt from "jsonwebtoken"
// import { ApolloServer } from "apollo-server";
import { typeDef } from "./schema"
import { resolver } from "./resolvers"
import * as depthLimit from "graphql-depth-limit"
import { AuthDirective } from "./control/AuthDirective"
import { JWTData } from "./entity/JWTData"
import { createServer } from "http"
import * as express from "express"
import { ApolloServer} from 'apollo-server-express'

const server = new ApolloServer({
    typeDefs: typeDef,
    resolvers: resolver,
    context: async({req}) =>{
        // console.log(req.body.operationName)
        // console.log(req.headers)
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
const PORT = 4000
const app = express()
server.applyMiddleware({app})
const ws = createServer(app)
server.installSubscriptionHandlers(ws)

createConnection().then(async connection => {
    // console.log("Here you can setup and run express/koa/any other framework.");
    // app.listen({ port: 4000 }, () =>
        
    // );
    ws.listen({ port: PORT }, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
      });
}).catch(error => console.log(error));
