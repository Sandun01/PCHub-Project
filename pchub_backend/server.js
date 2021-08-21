import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const app = express()

//a middleware to accpet json request body through the server 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('The API is working')
})

app.use(notFound)
app.use(errorHandler)

//calling the dotenv file
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
)