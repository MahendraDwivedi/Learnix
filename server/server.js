// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './configs/mongodb.js'
// import { clerkWebhooks } from './controllers/webhooks.js'
// import bodyParser from 'body-parser';


// // //initialize expresss

// const app = express()

// //connect to databse
// await connectDB()

// //middewares
// app.use(cors())

// //routes 
// app.get('/',(req,res)=> res.send('API working perfectly '))
// app.use('/clerk', bodyParser.raw({ type: '*/*' }));
// app.post('/clerk', clerkWebhooks);
// //port
// const PORT = process.env.PORT || 5000

// app.listen(PORT , ()=>{
//     console.log(`server is running on port ${PORT}`)
// })

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bodyParser from 'body-parser'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express()

await connectDB()

app.use(cors())

// 👇 must use raw for Clerk webhook verification
app.use('/clerk', bodyParser.raw({ type: '*/*' }))
app.post('/clerk', clerkWebhooks)

// 👇 use normal bodyParser everywhere else
app.use(express.json())

app.get('/', (req, res) => res.send('API working perfectly'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
