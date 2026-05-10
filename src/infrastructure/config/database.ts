import mongoose from "mongoose";
import config from "config";
import logger from "utils/logger";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
export const connectDB = async (): Promise<boolean> => {
  const MONGO_URI = config.MONGO_URL;
  if (!MONGO_URI) throw new AppError(ERROR_MESSAGES.DATABASE_CONNECTION_ERROR,HttpStatus.BAD_REQUEST);

  try {
    await mongoose.connect(MONGO_URI);
    return true;
  } catch (error) {
    logger.error("❌ Mongodb connection failed", error instanceof Error ? error : { message: String(error) });
    return false;
  }
}