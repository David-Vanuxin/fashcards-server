const path = require('path')
const express = require('express')
const app = express()
const fs = require("fs")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'static')))

let todoes = []

app.get('/', (req, res) => {
  let file = fs.readFileSync('./data.json', "utf8")
  file = JSON.parse(file)
  const keys = Object.keys(file)
  const modules = []
  if (keys.length != 0) {
    for (let k of keys) {
      modules.push({name: k, data: file[k]})
    }
  }
  res.render('index', {modules})
})

app.get('/add', (req, res) => {
  res.render('add')
})

const getReason = string => {
  let reason = ""
  if (typeof string === "undefined") {
    return null/*"посторонние символы"*/
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
  res = res.replaceAll(/\d+/g, "")
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

app.post('/add', (req, res) => {
  let tasks;
  try {
    tasks = remake(req.body.text)
  } catch (err) {
    res.render("error", {code: err})
    res.status(400)
    res.end()
    return
  }

  let file = fs.readFileSync('./data.json', "utf8")
  file = JSON.parse(file)
  for (let t of tasks) {
    if (file.hasOwnProperty(req.body.module)) {
      file[req.body.module].push(t)
    } else {
      const arr = []
      arr.push(t)
      file[req.body.module] = arr  
    }
  }
  fs.writeFileSync("./data.json", JSON.stringify(file))
  res.redirect("/")
})

app.get("/study/select", (req, res) => {
  const file = fs.readFileSync('./data.json', "utf8")
  const data = JSON.parse(file) 
  res.render("st-select", {modules: Object.keys(data)})
})

app.get("/study/run", (req, res) => {
  const selectedModule = JSON.parse(decodeURI(req.query.selected)).m
  const file = fs.readFileSync('./data.json', "utf8")
  const data = JSON.parse(file)
  const tasks = data[selectedModule]
  for (let t of tasks) {
    t.type = "typing_answer"
  }
  res.render("study", {step: Number(req.query.step ?? 0), tasks, selected: selectedModule})
})

app.post("/study/run", (req, res) => {
  const {answer, step, selected} = req.body
  const file = fs.readFileSync('./data.json', "utf8")
  const data = JSON.parse(file)
  const tasks = data[selected]
  for (let t of tasks) {
    t.type = "typing_answer"
  }
  if (answer !== tasks[Number(step - 1)].q) {
    res.render("mistake", {step: Number(step) - 1, tasks, selected, answer})
    return
  }
  res.render("study", {step, tasks, selected})
})

app.listen(3000, () => console.log("Server started"))