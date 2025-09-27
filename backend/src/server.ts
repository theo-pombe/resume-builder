import mongoose, { ConnectOptions } from "mongoose";
import app from "./app";

const mongoUri: string = process.env.MONGO_URI || "";
const options: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(mongoUri, options);
    console.log("Database connected");
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("DB connection error:", error.message);
    else console.error("Unknown DB error", error);
  }
}

connectDB();

// Start the Express server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
