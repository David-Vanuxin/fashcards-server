import sqlite3 from "sqlite3"
import { open } from 'sqlite'

const db = await open({
  filename: ":memory:",
  driver: sqlite3.Database
})

try {
  await db.exec(`CREATE TABLE Modules(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL);

CREATE TABLE Terms(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  answer TEXT NOT NULL,
  question TEXT NOT NULL,
  module INTEGER NOT NULL,
  FOREIGN KEY(module) REFERENCES Modules(id));`)
  
  console.log("Tables created")
} catch (err) {
  console.error(err.message)
}

export default async function openDb() {
  return await db
}