import { getRepository, createQueryBuilder } from "typeorm";
import { Book } from "./entity/Book";
import { Chapter } from "./entity/Chapter";
import { Word } from "./entity/Word";
import { User } from "./entity/User";
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcryptjs'

export const resolver = {
    Query: {
        books: async(_, __,  ___) => {
            const bookRepository = getRepository(Book)
            const books = await bookRepository.find()
            return books
        },
        login: async(_, {username, password}, __, ___) => {
            const userRepository = getRepository(User)
            const user:User = await userRepository.findOne({where:{username: username}})
            if(user && bcrypt.compareSync(password, user.password)){
                return jwt.sign({
                    data:user.id
                }, 'secret', { expiresIn: 60*10 })
            } else {
                return "error"
            }
        },
        chapters: async(_, {bookId}, __, ___) => {
            const chapterRepository = getRepository(Chapter)
            const book = new Book()
            book.id = bookId
            return await chapterRepository.find({where:{book:book}})
        }
    },
    Book: {
        chapters: async(book: Book, _, __, ___) => {
            const chapterRepository = getRepository(Chapter)
            return await chapterRepository.find({book: book})
        }
    },
    Chapter: {
        words: async(chapter: Chapter, _, __, ___) => {
            const result:Chapter = await getRepository(Chapter).findOne({relations: ["words"], where: {id: chapter.id}})
            return result.words
        }
    }
}