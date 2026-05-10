import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(), 
        logFormat
      ),
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
  ],
});

export default logger;