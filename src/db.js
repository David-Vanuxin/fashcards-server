import sqlite3 from "sqlite3"
import { open } from 'sqlite'
import { readFile } from 'node:fs/promises';

const db = await open({
  filename: ":memory:",
  driver: sqlite3.Database
})

try {
  const createTablesQuery = await readFile("./src/tables.sql", 'utf8')
  await db.exec(createTablesQuery.toString())
  console.log("Tables created")
} catch (err) {
  console.error(err.message)
}

export default async function openDb() {
  return await db
}