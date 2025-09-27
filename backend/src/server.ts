import app from "./app";

// Start the Express server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
