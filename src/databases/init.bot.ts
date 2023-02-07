import TelegramBot from 'node-telegram-bot-api';
const token = `${process.env.BOT_TELEGRAM_TOKEN}`;

const bot = new TelegramBot(token, { polling: true });

export default bot;
