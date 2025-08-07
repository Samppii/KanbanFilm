import winston from 'winston';
import { env } from './env';

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tfh-kanban-api' },
  transports: [
    new winston.transports.File({ 
      filename: env.LOG_FILE_PATH.replace('app.log', 'error.log'),
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: env.LOG_FILE_PATH 
    }),
  ],
});

// Add console transport for development
if (env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export { logger };