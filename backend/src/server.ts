import app from "./app.js";
import connectDB from "./database/index.js";

// Establish database connection
connectDB();

// Start the Express server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
