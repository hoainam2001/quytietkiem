import moment from 'moment';
import { formatUSD, formatVND } from '../utils/functions.utils';

export default class BotTelegramServices {
    send_message(bot: any, message: string, chatId: number) {
        try {
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (error: any) {
            console.log(error);
        }
    }

    send_message_add_deposit_telegram(
        bot: any,
        data: any,
        payment: any,
        user: any,
        chatId: number
    ) {
        try {
            // console.log(data);
            // console.log(payment);
            // console.log(user);
            const message = `<b>Type: Deposit</b>\n<b>Email: ${
                user?.payment?.email
            }</b>\n<b>Amount: ${formatUSD(
                parseInt(data?.amount)
            )}</b>\n<b>Amount VND: ${formatVND(
                parseInt(data?.amountVND)
            )}</b>\n<b>Bank Account receive:\n Bank: ${
                payment?.dataValues?.bank_name
            }\n Name: ${payment?.dataValues?.account_name}\n Number Card: ${
                payment?.dataValues?.account_number
            }</b>\n<b>Created At: ${moment(data?.createdAt).format(
                'llll'
            )}</b>\n\n <a href="https://bocdn.ecotree.green/blog/0001/01/ad46dbb447cd0e9a6aeecd64cc2bd332b0cbcb79.jpeg?d=240x135"> </a>\n\n\n<b>/confirm_deposit_${
                data?.id
            }</b>`;
            // console.log(message);
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (err: any) {
            console.log(err);
        }
    }

    send_message_add_withdraw_telegram(
        bot: any,
        data: any,
        payment: any,
        user: any,
        chatId: number
    ) {
        try {
            // console.log(data);
            // console.log(payment);
            // console.log(user);
            const message = `<b>Type: Withdraw</b>\n<b>Email: ${
                user?.payment?.email
            }</b>\n<b>Amount: ${formatUSD(
                parseInt(data?.amount)
            )}</b>\n<b>Amount VND: ${formatVND(
                parseInt(data?.amountVND)
            )}</b>\n<b>Bank Account receive:\n Bank: ${
                payment?.dataValues?.bank_name
            }\n Name: ${payment?.dataValues?.account_name}\n Number Card: ${
                payment?.dataValues?.account_number
            }</b>\n<b>Created At: ${moment(data?.createdAt).format(
                'llll'
            )}</b>\n\n<b>/confirm_withdraw_${data?.id}</b>`;
            // console.log(message);
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (err: any) {
            console.log(err);
        }
    }

    send_message_add_deposit(
        bot: any,
        data: any,
        payment: any,
        user: any,
        chatId: number,
        imageURL: string
    ) {
        try {
            // console.log(data);
            // console.log(payment);
            // console.log(user);
            const message = `<b>Type: Deposit</b>\n<b>Email: ${
                user?.payment?.email
            }</b>\n<b>Amount: ${formatUSD(
                parseInt(data?.amount)
            )}</b>\n<b>Amount VND: ${formatVND(
                parseInt(data?.amountVND)
            )}</b>\n<b>Bank Account receive:\n Bank: ${
                payment?.dataValues?.bank_name
            }\n Name: ${payment?.dataValues?.account_name}\n Number Card: ${
                payment?.dataValues?.account_number
            }</b>\n<b>Created At: ${moment(data?.createdAt).format(
                'llll'
            )}</b>\n\n <a href="${imageURL}"> </a>\n\n\n<b>/confirm_deposit_${
                data?.id
            }</b>`;
            // console.log(message);
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (err: any) {
            console.log(err);
        }
    }

    send_message_and_photo(
        bot: any,
        message: string,
        chatId: string,
        urlPhoto: string
    ) {
        try {
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            bot.sendPhoto(chatId, urlPhoto);
        } catch (error: any) {
            console.log(error);
        }
    }
}
