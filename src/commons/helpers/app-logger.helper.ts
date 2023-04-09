import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";
import 'winston-daily-rotate-file';

export const appLogger = WinstonModule.createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        format.colorize({ all: true }),
        format.printf((log) => `[Nest] 5277 - ${log.timestamp} : ${log.context} : ${log.level} : ${log.message}`)
      ),
    }),
    new transports.Console({
      level: "warning",
      format: format.combine(
        format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        format.colorize({ level: true }),
        format.printf((log) => `[Nest] 5277 - ${log.timestamp} : ${log.context} : ${log.level} : ${log.message} : ${log.stack}`)
      ),
    }),
    new transports.Console({
      level: "error",
      format: format.combine(
        format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        format.colorize({ level: true }),
        format.printf((log) => `[Nest] 5277 - ${log.timestamp} : ${log.context} : ${log.level} : ${log.message} : ${log.stack}`)
      ),
    }),
    new transports.DailyRotateFile({
      level: "warning",
      format: format.combine(
        format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        format.printf((log) => `[Nest] 5277 - ${log.timestamp} ${log.context} : ${log.message} : ${log.stack}`)
      ),
      filename: 'logs/errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new transports.DailyRotateFile({
      level: "error",
      format: format.combine(
        format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        format.printf((log) => `[Nest] 5277 - ${log.timestamp} ${log.context} : ${log.message} : ${log.stack}`)
      ),
      filename: 'logs/errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
})