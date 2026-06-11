import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const mongoUri =
      process.env.MONGO_URI as string;

    const dbName =
      process.env.MONGO_DB_NAME as string;

    await mongoose.connect(
      mongoUri,
      {
        dbName
      }
    );

    console.log(
      `MongoDB Connected : ${dbName}`
    );

  } catch (error) {

    console.error(
      "MongoDB Connection Error",
      error
    );

    process.exit(1);

  }
};

export default connectDB;