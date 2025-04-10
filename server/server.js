import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// //initialize expresss

const app = express()

//connect to databse
await connectDB()

//middewares
app.use(cors())

//routes 
app.get('/',(req,res)=> res.send('API working perfectly '))
app.post('/clerk',express.json(),clerkWebhooks)

//port
const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`)
})