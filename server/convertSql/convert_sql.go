package main
import (
  "fmt"
  "database/sql"
  _ "github.com/mattn/go-sqlite3"
)

func main(){
  db, err := sql.Open("sqlite3", "../word_back.sqlite")
  checkErr(err)
  db_new, err := sql.Open("sqlite3", "../word.sqlite")
  checkErr(err)
  // exportBook(db, db_new)
  // exportChapter(db, db_new)
  exportWord(db, db_new)
  exportChapterWord(db, db_new)
  db.Close()
  db_new.Close()
}

func exportBook(db, db_new *sql.DB){
  rows, err := db.Query("SELECT book_id, name, image, word_count, short_desc, desc FROM book")
  checkErr(err)
  for rows.Next(){
    var name string
    var id int
    var image string
    var count int
    var short_desc string
    var desc string
    err = rows.Scan(&id, &name, &image, &count, &short_desc, &desc)
    checkErr(err)
    fmt.Println(name)
    stmt, err := db_new.Prepare("REPLACE INTO book(id, name, image, word_count, short_desc, desc) VALUES (?,?,?,?,?,?)")
    checkErr(err)
    res, err := stmt.Exec(id, name, image, count, short_desc, desc)
    checkErr(err)
    insertId, err := res.LastInsertId()
    checkErr(err)
    fmt.Println(insertId)
  }
}

func exportChapter(db, db_new *sql.DB){
  rows, err := db.Query("SELECT chapter_id, name, word_count, book_id FROM chapter")
  checkErr(err)
  for rows.Next(){
    var id int
    var name string
    var count int
    var book_id int
    err = rows.Scan(&id, &name, &count, &book_id)
    checkErr(err)
    fmt.Println(name)
    stmt, err := db_new.Prepare("REPLACE INTO chapter(id, name, wordCount, bookId) VALUES (?,?,?,?)")
    checkErr(err)
    res, err := stmt.Exec(id, name, count, book_id)
    checkErr(err)
    insertId, err := res.LastInsertId()
    checkErr(err)
    fmt.Println(insertId)
  }
}

func exportWord(db, db_new *sql.DB){
  rows, err := db.Query("SELECT content_id, audio, pronunciation, definition, content FROM word")
  checkErr(err)
  for rows.Next(){
    var content_id int
    var audio string
    var pronunciation string
    var definition string
    var content string
    err = rows.Scan(&content_id, &audio, &pronunciation, &definition, &content)
    checkErr(err)
    fmt.Println(content)
    stmt, err := db_new.Prepare("REPLACE INTO word(content_id, audio, pronunciation, definition, content) VALUES (?,?,?,?,?)")
    checkErr(err)
    res, err := stmt.Exec(content_id, audio, pronunciation, definition, content)
    checkErr(err)
    insertId, err := res.LastInsertId()
    checkErr(err)
    fmt.Println(insertId)
  }
}

func exportChapterWord(db, db_new *sql.DB){
  rows, err := db.Query("SELECT chapter_id, word_id FROM chapter_word")
  checkErr(err)
  for rows.Next(){
    var chapter_id int
    var word_id int
    err = rows.Scan(&chapter_id, &word_id)
    checkErr(err)
    fmt.Println(chapter_id)
    stmt, err := db_new.Prepare("REPLACE INTO chapter_word(chapterId, wordId) VALUES (?,?)")
    checkErr(err)
    res, err := stmt.Exec(chapter_id, word_id)
    checkErr(err)
    insertId, err := res.LastInsertId()
    checkErr(err)
    fmt.Println(insertId)
  }
}

func checkErr(err error){
  if err != nil{
    panic(err)
  }
}