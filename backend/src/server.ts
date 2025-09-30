import app from "./app.js";
import connectDB from "./database/index.js";
import { authenticate, authorize } from "./middlewares/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import { errorLogger, requestLogger } from "./middlewares/loggers.js";
import accountRouter from "./routes/accountRouter.js";
import authRouter from "./routes/authRouter.js";
import { logger } from "./utils/logger.js";

async function startServer() {
  try {
    // Establish database connection
    await connectDB();
    logger.info("✅ Database connection established");

    // Global middlewares
    app.use(requestLogger);

    // Routes
    app.use("/api/v0/auth", authRouter);
    app.use("/api/v0/account", authenticate, accountRouter);

    // Error handling
    app.use(errorLogger);
    app.use(errorHandler);

    // Start the Express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server", error);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();
