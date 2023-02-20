import winston, { createLogger } from 'winston';
import 'winston-daily-rotate-file';

const setTimeZone = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

class Error {
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    getCode() {
        return this.code;
    }

    setCode(code: number) {
        this.code = code;
    }

    getMessage() {
        return this.message;
    }

    setMessage(message: string) {
        this.message = message;
    }
}

class LoggerBase {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    createLogger() {
        const transport = new winston.transports.DailyRotateFile({
            filename: './logs/logger/%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxFiles: '30d',
            maxSize: '5mb'
        });

        const logger = createLogger({
            format: winston.format.combine(
                winston.format.label({ label: `Logger ${this.name}` }),
                winston.format.timestamp({
                    format: setTimeZone
                }),
                winston.format.prettyPrint(),
                winston.format.printf((info: any) => {
                    return `[${this.name}] ${info.timestamp}:${info.label}:${info.message}`;
                })
            ),
            transports: [transport]
        });
        return logger;
    }
}

class LoggerErr extends LoggerBase {
    constructor(name: string) {
        super(name);
    }
}

export { LoggerErr, Error };
