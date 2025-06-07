import express from 'express'
import openDb from "../db.js"

const db = await openDb()

const modulesRouter = express.Router()

modulesRouter.get('/', async (req, res) => {
  const JSONobj = `json_object(
  'id', Modules.id, 
  'name', Modules.name, 
  'data', json_group_array(json_object(
    'id', Terms.id,  
    'a', Terms.question, 
    'q', Terms.answer)
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

/*modulesRouter.post('/add', async (req, res) => {
  let tasks;
  try {
    tasks = utils.remake(req.body.text)
  } catch (err) {
    res.render("error", {code: err})
    res.status(400)
    res.end()
    return
  }
  try {
    //const db = await openDb()
    const result = await db.run(`INSERT INTO Modules (name) VALUES ("${req.body.module}");`)
    for (let t of tasks) {
      await db.run(`INSERT INTO Terms (answer, question, module) VALUES ('${t.q}', '${t.a}', ${result.lastID});`)
    }
  } catch (err) {
    console.error(err)
    res.status(500)
    res.end()
    return
  }
  res.redirect("/")
})*/

export default modulesRouter