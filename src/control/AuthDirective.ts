import { SchemaDirectiveVisitor } from "graphql-tools";
import { AuthenticationError} from 'apollo-server'
import {GraphQLField, GraphQLSchema, GraphQLDirective, DirectiveLocation} from "graphql"

export class AuthDirective extends SchemaDirectiveVisitor{
    visitFieldDefinition(field: GraphQLField<any, any>){
        field.resolve = async (result, args, context, info) => {
            if(!context.user){
                return result[field.name]
            } else {
                throw new AuthenticationError("you must login")
            }
        }
    }
    static getDirectiveDeclaration(directiveName: string, schema: GraphQLSchema){
        return new GraphQLDirective({
            name: "auth",
            locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
        })
    }
}