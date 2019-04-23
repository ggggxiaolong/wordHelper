import { gql } from 'apollo-server';

export const typeDef = gql`

type Book {
    id: ID!
    name: String
    image: String
    wordCounr: Int
    shortDesc: String
    desc: String
    chapters: [!Chapter]
}

type Chapter{
    id: ID
    name: String
    wordCount: Int
    words: [!Word]
}

type Word {
    id: ID
    content: String
    audio: String
    pronunciation: String
    definition: String
    content: String
}

type User {
    id: ID!
    username: String
    nickname: String
    mail: String
}

type query{
    books: [!Book]
    chapters(bookId: ID): [!Chapter]
    words(chapterId: ID): [!Word]
    login(username: String!, password: String!): String!
}

input AddUser{
    username: String!
    nickname: String!
    password: String!
    mail: String!
    image: String
}

type Mutation {
    register(user: AddUser): User
}
`