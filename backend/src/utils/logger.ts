import winston from "winston";

const isDev = process.env.NODE_ENV !== "production";

export const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    ...(isDev
      ? [new winston.transports.Console()] // Verbose in dev
      : [new winston.transports.Console({ level: "error" })]), // Only errors in prod
  ],
});
