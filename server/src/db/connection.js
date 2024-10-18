import mongoose from "mongoose";

const connectDb = async () => {
  try {
    let connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected succesfuly ${connection.connection.host}`);
    // connection.connection.once('connected', () => {
    //     console.log('MongoDB connection established');
    //   });
  
    //   connection.connection.on('error', (err) => {
    //     console.error(`MongoDB connection error: ${err.message}`);
    //   });
  } catch (error) {
    console.log(`mongodb not connected succesfuly ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
