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

app.listen(3000, () => console.log("Server started"))