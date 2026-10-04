import { format, createLogger, transports } from 'winston';
import config from 'config';
import { NODE_ENV } from 'utils/Constants';
const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, label, timestamp, stack, ...meta }) => {
    const metadata = Object.keys(meta).length
        ? JSON.stringify(meta)
        : '';

    return `${timestamp} ${label} [${level}]: ${stack || message} ${metadata}`;
});

export const devLogger = () => {
    return createLogger({
        level: config.LOG_LEVEL,
        format: combine(
            label({ label: NODE_ENV.DEVELOPMENT }),
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