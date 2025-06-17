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
  	await db.run(`insert into Terms (answer, question, module)
  	values ('${req.body.answer}', '${req.body.question}', ${req.body.module});`)

  	const createdId = await db.get(`select id from Terms order by id desc limit 1;`)

    res.json({
      status: "success",
      id: createdId,
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

termsRouter.put("/:id", async (req, res) => {
  try {
  	const query = []

  	if (req.body.answer) query.push(`answer='${req.body.answer}'`)
		if (req.body.question) query.push(`question='${req.body.question}'`)
		if (req.body.module) query.push(`module='${req.body.module}'`)

  	if (!query) throw new Error("empty request")

  	await db.run(`update Terms set ${query.join(", ")} where id=${req.params.id};`)

  	const JSONobj = `json_object('id', Terms.id, 'answer', Terms.answer, 'question', Terms.question, 'module', Terms.module)`

  	const term = await db.get(`select ${JSONobj} from Terms where id=${req.params.id};`)

    res.json({
      status: "success",
      term: term[JSONobj]
    })
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
})

termsRouter.delete('/:id', async (req, res) => {
  try {
    await db.run(`delete from Terms where id=${req.params.id};`)
    res.json({ status: "success", message: req.params.id })
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message })
  }
})

export default termsRouter