import express from 'express'
import modulesRouter from "./routers/modules.js"
import termsRouter from "./routers/terms.js"
import openDb from "./db.js"

const app = express()
await openDb()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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