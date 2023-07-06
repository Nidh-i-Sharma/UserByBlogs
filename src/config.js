import mongoose from 'mongoose'

const connectDB = async (mongoDBURL) => {
  try {
      const conn = await mongoose.connect(mongoDBURL)
      console.log(`MongoDB Connected.....${conn}`)
  } catch (error) {
    console.log(error)
  }
} 
export default connectDB;