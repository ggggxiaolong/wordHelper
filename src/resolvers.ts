import { getRepository, createQueryBuilder, getConnection, EntityManager, MoreThan } from "typeorm";
import { Book } from "./entity/Book";
import { Chapter } from "./entity/Chapter";
import { Word } from "./entity/Word";
import { User } from "./entity/User";
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcryptjs'
import { AuthenticationError, PubSub, withFilter } from "apollo-server";
import { Token } from "./entity/Token";
import { JWTData } from "./entity/JWTData";
import { Plan } from "./entity/Plan";
import { UserPlan } from "./entity/UserPlan";
import { Learn } from "./entity/Learn";
import { CHANNEL_TODAY_WORDS } from "./Pubsub";

const pubsub = new PubSub()
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
    Mutation: {
        addPlan: async(parent , {bookId, dailyWord}, {user}:{ user: User}, info) => {
            const planRepo = getRepository(Plan)
            const plan = new Plan()
            plan.bookId = bookId
            plan.dailyWord = dailyWord
            plan.userId = user.id
            plan.wordId = 0
            plan.createDate = Date.now()
            await planRepo.save(plan)
            const userPlan = new UserPlan()
            userPlan.bookId = bookId
            const bookRepo = getRepository(Book)
            const book = await bookRepo.findOne({where: {id: bookId}})
            userPlan.bookName = book.name
            userPlan.bookWordCount = book.wordCount
            userPlan.dailyWord = dailyWord
            // learnedCountBeforToday remainDays todayWords
            userPlan.remainDays = Math.ceil(book.wordCount / dailyWord)
            const todayTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
            const maxWordId = await getConnection().query(`SELECT MAX(wordId) FROM learn WHERE userId = ? AND bookId = ? AND createDate < ?`,[user.id, bookId, todayTime])
            const todayWords = await getRepository(Word).find({where: {id: MoreThan(maxWordId)}, take: dailyWord, order: {id: "ASC"}})
            // const learnedCountBeforToday = await getConnection().query(`SELECT COUNT(1) FROM learn WHERE userId = ? AND bookId = ? AND createDate < ?`,[user.id, bookId, todayTime])
            const {learnedCountBeforToday} = await getRepository(Learn).createQueryBuilder("learn")
                .select("COUNT(1)", "learnedCountBeforToday").where("learn.userId = :userId AND learn.bookId = :bookId AND learn.createDate < :createDate",
                {userId: user.id, bookId: bookId, createDate:todayTime}).getRawOne()
            userPlan.todayWords = todayWords
            userPlan.learnedCountBeforToday = learnedCountBeforToday
            return userPlan
        },
        addLearn: async(parent, {bookId, wordId}, {user}: {user: User}, info) => {
            const learnRepo = getRepository(Learn)
            const learn = new Learn()
            learn.userId = user.id
            learn.bookId = bookId
            learn.wordId = wordId
            learn.createDate = Date.now()
            await learnRepo.save(learn)
            const todayTime = new Date(new Date().setHours(0, 0, 0, 0))
            const todayWords = await getConnection().query("SELECT word.* from learn join word on word.id = learn.wordId where learn.userId = ? and learn.bookId = ? and createDate > ?",[user.id, bookId, todayTime])
            console.log(todayWords)
            await pubsub.publish(CHANNEL_TODAY_WORDS, {todayLeanedWords:todayWords, userId: user.id})
            return "success"
        }
    },
    Subscription:{
        todayLeanedWords: {
            subscribe: withFilter(() => pubsub.asyncIterator(CHANNEL_TODAY_WORDS), (payload, variables) => {
                console.log(payload)
                return payload.userId === variables.userId
            }),
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