import { createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import config from 'config';

const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `${timestamp} ${label} [${level}]: ${stack || message}`;
});

export const ProductionLogger = () => {
    return createLogger({
        level: config.LOG_LEVEL,
        format: combine(
            label({ label: 'prod' }),
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new DailyRotateFile({
                filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
                datePattern: config.LOG_DATE_PATTERN,
                zippedArchive: true,
                maxSize: config.LOG_MAX_SIZE,
                maxFiles: config.LOG_COMBINED_RETENTION,
                format: myFormat
            }),


            new DailyRotateFile({
                filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
                datePattern: config.LOG_DATE_PATTERN,
                zippedArchive: true,
                maxSize: config.LOG_MAX_SIZE,
                maxFiles: config.LOG_ERROR_RETENTION,
                level: 'error',
                format: myFormat
            })
        ]
    });
};