import { format, createLogger, transports } from 'winston';
import config from 'config';
const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `${timestamp} ${label} [${level}]: ${stack || message}`;
});

export const devLogger = () => {
    return createLogger({
        level: config.LOG_LEVEL,
        format: combine(
            label({ label: 'dev' }),
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({

                format: combine(
                    format.colorize(),
                    myFormat
                )
            })
        ]
    });
};