import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import WishlistRouts from './src/routes/WishlistRouts.js'
import ProductRouts from './src/routes/ProductRouts.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())


app.use('/wishlist', WishlistRouts)
app.use('/product', ProductRouts)

//connect to the database
connectDB()

const app = express()

//a middleware to accpet json request body through the server 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('The API is working')
})

//Routing to relavent Roters
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.use(notFound)
app.use(errorHandler)

//calling the dotenv file
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
<<<<<<< HEAD
)
=======
)





>>>>>>> 2d183e3f0482682e62ad8e5472e8974476471888
