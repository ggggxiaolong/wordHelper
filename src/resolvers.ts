import { getRepository, createQueryBuilder, getConnection, EntityManager } from "typeorm";
import { Book } from "./entity/Book";
import { Chapter } from "./entity/Chapter";
import { Word } from "./entity/Word";
import { User } from "./entity/User";
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcryptjs'
import { AuthenticationError } from "apollo-server";
import { Token } from "./entity/Token";
import { JWTData } from "./entity/JWTData";

export const resolver = {
    Query: {
        books: async (_, { pageSize = 20, page = 0 }, ___) => {
            const bookRepository = getRepository(Book)
            const books = await bookRepository.find({ take: pageSize, skip: page })
            return books
        },
        login: async (_, { username, password }, __, ___) => {
            const userRepository = getRepository(User)
            const user: User = await userRepository.findOne({ where: { username: username } })
            if (user && bcrypt.compareSync(password, user.password)) {
                user.password = ''
                const refreshToken = jwt.sign({user: user, isRefresh: true}, 'secret',{ expiresIn: 60 * 60 * 24 * 7})
                const accessToken = jwt.sign({user: user, isRefresh: false}, 'secret',{ expiresIn: 60 * 60})
                const token = new Token(accessToken, refreshToken)
                return token
            } else {
                throw new AuthenticationError("error username or password")
            }
        },
        refreshToken: async(_,{token}, __, ___) => {
            try{
                const data = <JWTData>jwt.verify(token, "secret",{ignoreExpiration: true})
                if(data.isRefresh){
                    const refreshToken = jwt.sign({user: data.user, isRefresh: true}, 'secret',{ expiresIn: 60 * 60 * 24 * 7})
                    const accessToken = jwt.sign({user: data.user, isRefresh: false}, 'secret',{ expiresIn: 60 * 60})
                    return new Token(accessToken, refreshToken)
                } else {
                    throw new AuthenticationError("error refres token")
                }
            } catch(e){
                return new AuthenticationError("refres token fail")
            }
        },
        chapters: async (_, { bookId, pageSize = 20, page = 0 }, __, ___) => {
            const chapterRepository = getRepository(Chapter)
            const book = new Book()
            book.id = bookId
            return await chapterRepository.find({ where: { book: book }, take: pageSize, skip: page })
        },
        words: async (_, { chapterId, pageSize = 20, page = 0 }, context, info) => {
            const repo = getRepository(Word)
            const words = await repo.query(
                `SELECT word.* 
                from chapter_word join word on word.id = chapter_word.wordId 
                WHERE chapter_word.chapterId = ? limit ? offset ?`,
                [chapterId, pageSize, page]
            )
            return words
        }
    },
    Book: {
        chapters: async (book: Book, _, __, ___) => {
            const chapterRepository = getRepository(Chapter)
            return await chapterRepository.find({ book: book })
        }
    },
    Chapter: {
        words: async (chapter: Chapter, { pageSize = 20, page = 0 }, __, ___) => {
            const repo = getRepository(Word)
            const words = await repo.query(
                `SELECT word.* 
                from chapter_word join word on word.id = chapter_word.wordId 
                WHERE chapter_word.chapterId = ? limit ? offset ?`,
                [chapter.id, pageSize, page]
            )
            return words
        }
    }
}