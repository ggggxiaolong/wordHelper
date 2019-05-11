import { Word } from "./Word";

export class UserPlan {
    bookId: number
    bookName: String
    // 单词书一共包含的单词数
    bookWordCount: number
    // 今天之前已经学习的单词数
    learnedCountBeforToday: number
    // 每天需要学习的单词数
    dailyWord: number
    // 今天需要学习的单词数
    todayWords: Word[]
    // 还需要学习的天数(包含今天)
    remainDays: number
}