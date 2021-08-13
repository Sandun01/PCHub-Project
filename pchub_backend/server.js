import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './src/config/db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

//connect to the database
connectDB()

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api is working')
});

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)


