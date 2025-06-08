import sqlite3 from "sqlite3"
import {open} from 'sqlite'

export default async function openDb () {
  return open({
    filename: process.env.DATABASE,
    driver: sqlite3.Database
  })
}