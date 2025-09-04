import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    console.log(`MONGODB connected:, ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


export default connectDB