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

export default modulesRouter