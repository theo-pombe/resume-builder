import app from "./app.js";
import connectDB from "./database/index.js";
import errorHandler from "./middlewares/errorHandler.js";

// Establish database connection
connectDB();

app.use(errorHandler);

// Start the Express server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
