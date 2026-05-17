import mongoose from "mongoose";

const connectDb = async()=>{
   try{
      const connect = await mongoose.connect(process.env.MONGO_URI)
      console.log('Connected to Db ' + connect.connection.host)
   }catch(err){
      console.log('Connection to DB failed ' + err.message)
      process.exit(1)
   }
}

export default connectDb