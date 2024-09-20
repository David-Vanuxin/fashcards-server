import express from 'express'
import sqlite3 from "sqlite3"
import {open} from 'sqlite'
import {remake} from "./utils.js"

async function openDb () {
  return open({
    filename: 'data',
    driver: sqlite3.Database
  })
}

const app = express()
const db = await openDb()

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./static'))

app.get('/', async (req, res) => {
  //const db = await openDb()

  const data = await db.all(`select json_object('name', Modules.name, 'data', json_group_array(json_object('a', Terms.question, 'q', Terms.answer))) from Terms join Modules on Terms.module=Modules.id group by Modules.id;`)

  const modules = []

  for(const termsList of data) {
    modules.push(JSON.parse(termsList["json_object('name', Modules.name, 'data', json_group_array(json_object('a', Terms.question, 'q', Terms.answer)))"]))
  }

  res.render('index', {modules})
})

app.get("/module/:id", async (req, res) => {
  //const db = await openDb()
  const terms = await db.all(`SELECT question, answer FROM Terms WHERE Terms.module=${req.params.id};`)
  res.set({
    "Content-Type":"application/json"
  })
  res.json(terms)
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', async (req, res) => {
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
})

app.get("/study/select", async (req, res) => {
  //const db = await openDb()
  const modules = await db.all("SELECT name FROM Modules;")
  const names = []
  for (let m of modules) names.push(m.name)
  res.render("st-select", {modules: names})
})

app.get("/study/run", async (req, res) => {
  const selectedModule = JSON.parse(decodeURI(req.query.selected)).m
  //const db = await openDb()
  const tasks = await db.all(`SELECT answer AS a, question AS q FROM Terms JOIN Modules WHERE Terms.module = Modules.id AND Modules.name="${selectedModule}";`)
  for (let t of tasks) {
    t.type = "typing_answer"
  }
  if (req.query.type == "tatar") {
    res.render("study-tat2rus", {step: Number(req.query.step ?? 0), tasks, selected: selectedModule})
  }
  if (req.query.type == "russian") {

    res.render("study-rus2tat", {step: Number(req.query.step ?? 0), tasks, selected: selectedModule})
  }
})

app.post("/study/run", async (req, res) => {
  const {answer, step, selected, type} = req.body
  //const db = await openDb()
  const tasks = await db.all(`SELECT answer AS a, question AS q FROM Terms JOIN Modules WHERE Terms.module = Modules.id AND Modules.name="${selected}";`)
  for (let t of tasks) {
    t.type = "typing_answer"
  }
  if (req.body.type == "tatar") {
    if (answer !== tasks[Number(step - 1)].q) {
      res.render("mistake", {step: Number(step) - 1, tasks, selected, answer})
      return
    }
    res.render("study-tat2rus", {step, tasks, selected})
    return
  }
  if (req.body.type == "russian") {
    if (answer !== tasks[Number(step - 1)].a) {
      res.render("mistake", {step: Number(step) - 1, tasks, selected, answer})
      return
    }
    res.render("study-rus2tat", {step, tasks, selected})
  }
});

app.listen(3000, () => console.log("Server started"));

// })()