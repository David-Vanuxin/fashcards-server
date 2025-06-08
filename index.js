import express from 'express'
import {remake} from "./utils.js"
import modulesRouter from "./routers/modules.js"
import termsRouter from "./routers/terms.js"
import openDb from "./db.js"

const app = express()
const db = await openDb()

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./static'))

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': "*",
    'Access-Control-Allow-Headers': "*",
  })
  next()
})

app.use('/module', modulesRouter)
app.use('/term', termsRouter)

app.listen(3000, () => console.log("Server started"));