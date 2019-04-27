import { SchemaDirectiveVisitor, GraphQLArgument } from "graphql-tools";
import { AuthenticationError} from 'apollo-server'
import {GraphQLField} from 'graphql'

class AuthDirective extends SchemaDirectiveVisitor{
    visitArgumentDefinition(field: GraphQLArgument){
        field.resolve = async (result, args, context, info) => {
            if(!context.user){
                return result[field.name]
            } else {
                throw new AuthenticationError("you must login")
            }
        }
    }
}