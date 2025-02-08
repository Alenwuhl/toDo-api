import winston from 'winston';
import path from 'path';
import 'winston-daily-rotate-file';

// colors for every log level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
};

// add colors to winston
winston.addColors(colors);

// format for the logs
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
    level: 'debug', // lowwest level to log
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.simple()
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join('logs', 'info-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join('logs', 'errors-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});

export default logger;
