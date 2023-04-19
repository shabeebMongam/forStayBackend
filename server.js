require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8000
const adminRouter = require('./routes/adminRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const ownerRouter = require('./routes/ownerRoutes')
const cors = require('cors')
const connectWithDB = require('./helpers/dbConnection/dbConnect')
mongoose.set('strictQuery', true)
const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())

app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/owner', ownerRouter)


connectWithDB(process.env.MONGO_URI)
app.listen(PORT, () => { console.log(`http://localhost:${PORT}/`); })