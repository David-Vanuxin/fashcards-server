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

const remake = text => {
  let res;
  res = text.replaceAll(/\d+/g, "")
  res = res.replaceAll(/\s–\s/g, "...")
  const list = res.split("\n")
  const result = []
  for (let string of list) {
    string = string.split("...")
    result.push({
      q: string[0],
      a: string[1].replace("\r", "")
    })
  }
  return result 
}

app.post('/add', (req, res) => {
  let tasks = remake(req.body.text)
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
  console.log({ answer, step, tasks })
  if (answer !== tasks[Number(step - 1)].q) {
    //console.log(step)
    res.render("mistake", {step: Number(step) - 1, tasks, selected, answer})
    return
  }
  res.render("study", {step, tasks, selected})
})

app.listen(3000, () => console.log("Server started"))