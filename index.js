const path = require('path')
const express = require('express')
const app = express()
const fs = require("fs")

const sqlite3 = require("sqlite3")
const {open} = require('sqlite')

async function openDb () {
  return open({
    filename: 'data',
    driver: sqlite3.Database
  })
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'static')))

app.use('/*', (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin":"*"
  })
  next()
})

let todoes = []

app.get('/', async (req, res) => {
  const db = await openDb()
  const rows = await db.all("SELECT id, name FROM Modules;")
  const modules = []

  for (let r of rows) {
    const terms = []

    const terms_rows = await db.all(`SELECT question, answer FROM Terms WHERE Terms.module=${r.id};`)

    for (let t_r of terms_rows) {
      terms.push({q: t_r.answer, a: t_r.question})
    } 

    modules.push({name: r.name, data: terms})
  }
  res.render('index', {modules})
})

app.get("/module/:id", async (req, res) => {
  const db = await openDb()
  const terms = await db.all(`SELECT question, answer FROM Terms WHERE Terms.module=${req.params.id};`)
  res.set({
    "Content-Type":"application/json"
  })
  res.json(terms)
})

app.get('/add', (req, res) => {
  res.render('add')
})

const getReason = string => {
  let reason = ""
  if (typeof string === "undefined") {
    return null
  }
  if (!string.includes("...")) {
    reason += "отсутствует разделитель; "
  }
  if (typeof string.split("...")[0] === "undefined") {
    reason += "отсутствует вопрос; "
  }
  if (typeof string.split("...")[1] === "undefined") {
    reason += "отсутствует ответ; "
  }
  if (reason == "") {
    reason = "неизвестна"
  }
  reason = reason + "..."
  reason = reason.replace("; ...", "")
  return reason
}

const remake = (text, separator = new RegExp(/\s–\s/g)) => {
  let res;
  res = text.replaceAll(/^!?[^а-я,А-Я]+/g, "")  
  res = res.replaceAll(separator, "...")
  const list = res.split("\n")
  const result = []
  for (let n = 0; n <= list.length; n++) {
    let string = list[n]
    try {
      let splitted_string = string.split("...")
      result.push({
        q: splitted_string[0],
        a: splitted_string[1].replace("\r", "")
      })
    } catch (err) {
      const reason = getReason(string)
      if (reason == null) continue
      const new_list = []
      Object.assign(new_list, list)
      let sample = new_list.splice(n - 2, n + 2).join("\n")
      sample = sample.replaceAll("...", " -> ")
      throw new Error(`\n${sample}\nНе удалось разобрать строку: "${string}"\nПричина: ${reason}`)
    }
  }
  return result 
}

app.post('/add', async (req, res) => {
  let tasks;
  try {
    tasks = remake(req.body.text)
  } catch (err) {
    res.render("error", {code: err})
    res.status(400)
    res.end()
    return
  }
  try {
    const db = await openDb()
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
  const db = await openDb()
  const modules = await db.all("SELECT name FROM Modules;")
  const names = []
  for (let m of modules) names.push(m.name)
  res.render("st-select", {modules: names})
})

app.get("/study/run", async (req, res) => {
  const selectedModule = JSON.parse(decodeURI(req.query.selected)).m
  const db = await openDb()
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
  const db = await openDb()
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
})

app.listen(3000, () => console.log("Server started"))