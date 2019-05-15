import { gql } from 'apollo-server';

export const typeDef = gql`
directive @auth on OBJECT | FIELD_DEFINITION
type Book {
    id: ID!
    name: String
    image: String
    wordCount: Int
    shortDesc: String
    desc: String
    chapters: [Chapter!]
}

type Chapter{
    id: ID
    name: String
    wordCount: Int
    words: [Word!]
}

type Word {
    id: ID
    content: String
    audio: String
    pronunciation: String
    definition: String
}

type User {
    id: ID!
    username: String
    nickname: String
    mail: String
}
type Token{
    accessToken: String!
    refreshToken: String!
}
type Plan{
    bookId: Int!
    bookName: String!
    bookWordCount: Int!
    learnedCountBeforToday: Int!
    dailyWord: Int!
    todayWords: [Word]!
    remainDays: Int!
}

type Query{
    books(pageSize: Int, page: Int): [Book!] @auth
    chapters(bookId: ID): [Chapter!] @auth
    words(chapterId: ID, pageSize: Int, page: Int): [Word!] @auth
    login(username: String!, password: String!): Token!
    refreshToken(token: String): Token!
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
    addPlan(bookId: Int!, dailyWord: Int!): Plan! @auth
    addLearn(bookId: Int!, wordId: Int!): String @auth
}

type Subscription {
    todayLeanedWords(userId: ID): [Word]! @auth
}
`