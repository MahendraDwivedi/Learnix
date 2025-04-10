import mongoose from "mongoose";

// connect to the mongodb databse

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=>console.log('datanase connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
}

export default connectDB