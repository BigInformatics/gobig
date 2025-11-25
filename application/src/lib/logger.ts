type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const formatMessage = (level: LogLevel, message: string, ...args: unknown[]): string => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (args.length > 0) {
    return `${prefix} ${message} ${JSON.stringify(args, null, 2)}`;
  }
  
  return `${prefix} ${message}`;
};

const logger: Logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(formatMessage('info', message, ...args));
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(formatMessage('warn', message, ...args));
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    // Always log errors, even in production
    console.error(formatMessage('error', message, ...args));
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(formatMessage('debug', message, ...args));
    }
  },
};

export default logger;

