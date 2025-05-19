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
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoute.js'

// initalize express
const app = express()

//connect to databasse
await connectDB()
await connectCloudinary()

//middlewares
app.use(cors())
app.use(clerkMiddleware())

// 👇 must use raw for Clerk webhook verification
app.use('/clerk', bodyParser.raw({ type: '*/*' }))
app.post('/clerk', clerkWebhooks)
app.use('/api/educator' , express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({ type: 'application/json' }) , stripeWebhooks)
app.use("/api", courseRouter); 
// 👇 use normal bodyParser everywhere else
app.use(express.json())

app.get('/', (req, res) => res.send('API working perfectly'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
