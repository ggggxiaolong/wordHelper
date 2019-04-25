import { getRepository, createQueryBuilder } from "typeorm";
import { Book } from "./entity/Book";
import { Chapter } from "./entity/Chapter";
import { Word } from "./entity/Word";
import { User } from "./entity/User";
import {jsonwebtoken} from "jsonwebtoken"

export const resoler = {
    Query: {
        books: async(_, __,  ___) => {
            const bookRepository = getRepository(Book)
            const books = await bookRepository.find()
            return books
        },
        login: async(_, {username, password}, __, ___) => {
            const userRepository = getRepository(User)
            const user = userRepository.find({where:{username: username, password: password}})
            if(user){

            } else {

            }
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
                return await createQueryBuilder("chapter_word")
                    .select("word")
                    .innerJoinAndSelect(Word, "word", "chapter_word.chapterId = :chapterId", {chapterId: chapter.id})
                .getMany()
        }
    }
}