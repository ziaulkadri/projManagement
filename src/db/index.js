import mongoose, { connect } from "mongoose";



const connectDb = async () => {
  try {
    await connect(process.env.Mongo_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDb;