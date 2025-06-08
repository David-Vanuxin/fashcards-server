import express from 'express'
import openDb from "../db.js"

const db = await openDb()

const termsRouter = express.Router()

termsRouter.get("/:id", async (req, res) => {
  try {
  	const JSONobj = `json_object(
  	'id', Terms.id,
  	'answer', Terms.answer,
  	'question', Terms.question)`

  	const term = await db.get(`select ${JSONobj} 
  	from Terms where Terms.id=${req.params.id};`)

    res.json({
      status: "success",
      term: term[JSONobj]
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

termsRouter.post("/", async (req, res) => {
  try {

    res.json({
      status: "success",
      // ...
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

termsRouter.put("/:id", async (req, res) => {
  try {

    res.json({
      status: "success",
      // ...
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

termsRouter.delete("/:id", async (req, res) => {
  try {

    res.json({
      status: "success",
      // ...
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

export default termsRouter