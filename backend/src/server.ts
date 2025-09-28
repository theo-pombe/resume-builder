import app from "./app.js";
import connectDB from "./database/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";

// Establish database connection
connectDB();

//
app.use("/api/v0/auth", authRouter);

//
app.use(errorHandler);

// Start the Express server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
