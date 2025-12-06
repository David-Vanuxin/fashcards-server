import sqlite3 from "sqlite3"
import { open } from 'sqlite'
import fs from 'node:fs/promises';

const dbFilename = process.env.DATABASE || "data.db"

if (process.env.DATABASE === undefined) {
  console.warn("Database file name not specified\nCreate file data.db\n")
  createDatabase()
}

export default async function openDb () {
  return open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
}

async function createDatabase() {
  try {
    await fs.open(dbFilename, "wx")
  } catch (err) {
    return console.log(`File ${dbFilename} already exists`)
  }

  try {
    const db = await openDb()
    const createTablesQuery = await fs.readFile("tables.sql", 'utf8')
    await db.exec(createTablesQuery.toString())
  } catch (err) {
    console.error(err.message)
  }
}