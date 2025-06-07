import express from 'express'
import openDb from "../db.js"

const db = await openDb()

const modulesRouter = express.Router()

modulesRouter.get('/', async (req, res) => {
  const JSONobj = `json_object(
  'id', Modules.id, 
  'name', Modules.name, 
  'terms', json_group_array(json_object(
    'id', Terms.id,  
    'answer', Terms.question, 
    'question', Terms.answer)
    )
  )`
  const data = await db.all(`
  select ${JSONobj} 
  from Terms join Modules on Terms.module=Modules.id
  group by Modules.id;`)

  const modules = data.map(termList => JSON.parse(termList[JSONobj]))
  res.json(modules)
})

modulesRouter.get("/:id", async (req, res) => {
  const terms = await db.all(`SELECT question, answer FROM Terms WHERE Terms.module=${req.params.id};`)
  res.json(terms)
})

modulesRouter.post('/', async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ status: "error", message: "invalid name" })
    console.log("Invalid name", req.body.name)
    return
  }

  await db.run(`insert into Modules (name) values ('${req.body.name}');`)

  const { id: createdModuleId } = await db.get("select id from Modules order by id desc limit 1;")

  const sql = req.body.terms.reduce((query, term) => 
    query += `insert into Terms (answer, question, module) values ('${term.answer}', '${term.question}', ${createdModuleId});`, "")

  await db.exec(sql)

  res.json({ status: "success", message: createdModuleId })
})

modulesRouter.delete('/:id', async (req, res) => {
  try {
    await db.run(`delete from Modules where id=${req.params.id};`)
    res.json({ status: "success", message: req.params.id })
  } catch (e) {
    res.status(400).json({ status: "error", message: "can't delete module" })
    console.log("Error with deleting module", req.params.id)
  }
})

export default modulesRouter