import express from 'express'
import {remake} from "./utils.js"
import modulesRouter from "./routers/modules.js"
import openDb from "./db.js"

const app = express()
const db = await openDb()

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./static'))

app.use('/module', modulesRouter)

/*app.get("/study/select", async (req, res) => {
  const modules = await db.all("SELECT name FROM Modules;")
  const names = []
  for (let m of modules) names.push(m.name)
  res.render("st-select", {modules: names})
})

app.get("/study/run", async (req, res) => {
  const selectedModule = JSON.parse(decodeURI(req.query.selected)).m
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
});*/

app.listen(3000, () => console.log("Server started"));