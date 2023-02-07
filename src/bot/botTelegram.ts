import axios from 'axios';
import bot from '../databases/init.bot';
import BotTelegramServices from '../services/bot.services';
import PaymentServices from '../services/payment.services';
import { UserServices } from '../services/user.services';
import WithdrawServices from '../services/withdraw.services';
import { DEPOSIT_STATUS, WITHDRAW_STATUS } from '../types/enum';
import { formatUSD } from '../utils/functions.utils';

const bot_services = new BotTelegramServices();
const user_services = new UserServices();
const payment_services = new PaymentServices();
const withdraw_services = new WithdrawServices();

const add_deposit = async (
    amount: string,
    idPayment: string,
    email: string,
    chatId: number,
    create_by: string
) => {
    try {
        const user: any = await user_services
            .get_user_by_email(email)
            .then((result: any) => result.data);
        const add_deposit_result = await axios
            .post(`${process.env.URL}/users/deposit/${user._id}`, {
                status: 'Pending',
                amountVND: parseInt(amount) * 23000,
                note: create_by,
                amount: parseInt(`${amount}`),
                idPayment: parseInt(`${idPayment}`)
            })
            .then((data: any) => data.data.data);
        const get_payment: any = await payment_services
            .find_payment_by_id(parseInt(idPayment))
            .then((data: any) => data.data);
        bot_services.send_message_add_deposit_telegram(
            bot,
            add_deposit_result,
            get_payment,
            user,
            chatId
        );
    } catch (err: any) {
        bot_services.send_message(bot, `${err.message}`, chatId);
    }
};

const add_withdraw = async (
    amount: string,
    idPayment: string,
    email: string,
    chatId: number,
    create_by: string
) => {
    try {
        const user: any = await user_services
            .get_user_by_email(email)
            .then((result: any) => result.data);
        if (!user) {
            bot_services.send_message(
                bot,
                `<b>User is not valid with email = ${email}</b>`,
                chatId
            );
        } else {
            const withdraw = {
                status: 'Pending',
                amountVND: parseInt(amount) * 22900,
                note: create_by,
                amount: parseInt(`${amount}`),
                userId: `${user?._id}`
            };
            const add_withdraw_result = await withdraw_services
                .create_withdraw(withdraw, parseInt(idPayment))
                .then((result: any) => result.data);
            const get_payment: any = await payment_services
                .find_payment_by_id(parseInt(idPayment))
                .then((data: any) => data.data);
            bot_services.send_message_add_withdraw_telegram(
                bot,
                add_withdraw_result,
                get_payment,
                user,
                chatId
            );
        }
    } catch (err: any) {
        bot_services.send_message(bot, `${err.message}`, chatId);
    }
};

const confirm_deposit = async (chatId: number, idDeposit: string) => {
    try {
        const confirmed_deposit: any = await axios
            .put(`${process.env.URL}/admin/handleDeposit/${idDeposit}`, {
                status: DEPOSIT_STATUS.COMPLETED
            })
            .then((result: any) => result.data.data.data);
        const get_deposit: any = await axios
            .get(`${process.env.URL}/admin/deposit/${idDeposit}`)
            .then((result: any) => result?.data?.data);
        const message = `<b>Confirm deposit successfully with amount = ${formatUSD(
            parseInt(get_deposit?.amount)
        )}</b>\n<b>Balance now: ${formatUSD(
            parseInt(confirmed_deposit?.Wallet?.balance)
        )}</b>`;
        bot_services.send_message(bot, message.toUpperCase(), chatId);
    } catch (error: any) {
        bot_services.send_message(bot, `${error.message}`, chatId);
    }
};

const confirm_withdraw = async (chatId: number, idWithdraw: string) => {
    try {
        const confirm_withdraw: any = await axios
            .put(`${process.env.URL}/admin/handleWithdraw/${idWithdraw}`, {
                status: WITHDRAW_STATUS.CONFIRMED
            })
            .then((result: any) => result?.data?.data?.data);

        const get_withdraw: any = await axios
            .get(`${process.env.URL}/admin/withdraw/${idWithdraw}`)
            .then((result: any) => result?.data?.data);
        const message = `<b>Confirm withdraw successfully with amount = ${formatUSD(
            parseInt(get_withdraw?.amount)
        )}</b>\n<b>Balance now: ${formatUSD(
            parseInt(confirm_withdraw?.Wallet?.balance)
        )}</b>`;

        bot_services.send_message(bot, message.toUpperCase(), chatId);
        await axios.put(
            `${process.env.URL}/admin/handleWithdraw/${idWithdraw}`,
            {
                status: WITHDRAW_STATUS.COMPLETED
            }
        );
    } catch (error: any) {
        bot_services.send_message(bot, `${error.message}`, chatId);
    }
};

const command_bot: any = {
    add_deposit: add_deposit,
    add_deposit_rule: `add;deposit;email;amount;idPayment`,
    add_deposit_length: 5,
    confirm_deposit: confirm_deposit,
    add_withdraw: add_withdraw,
    add_withdraw_rule: `add;withdraw;email;amount;idPayment`,
    add_withdraw_length: 5,
    confirm_withdraw: confirm_withdraw
};

bot.onText(/\/start/, (msg) => {
    const name = `telegram_${msg?.from?.first_name} ${msg?.from?.last_name}`;
    bot.sendMessage(
        msg.chat.id,
        `<b>chat Id: ${msg.chat.id}</b> \n<b>${name}</b>`,
        { parse_mode: 'HTML' }
    );
});

bot.onText(/\/confirm_deposit_.+$/, (msg) => {
    try {
        const chatId = msg.chat.id;
        const command: Array<string> = msg.text?.split('_') || [];
        if (command.length === 0) {
            bot_services.send_message(bot, `Command is false`, chatId);
        } else {
            const command_name = `${command[0].replace('/', '')}_${command[1]}`;
            command_bot[command_name](chatId, command[2]);
        }
    } catch (error: any) {
        bot_services.send_message(bot, `${error.message}`, msg.chat.id);
    }
});

bot.onText(/\/confirm_withdraw_.+$/, (msg) => {
    try {
        const chatId = msg.chat.id;
        const command: Array<string> = msg.text?.split('_') || [];
        if (command.length === 0) {
            bot_services.send_message(bot, `Command is false`, chatId);
        } else {
            const command_name = `${command[0].replace('/', '')}_${command[1]}`;
            command_bot[command_name](chatId, command[2]);
        }
    } catch (error: any) {
        bot_services.send_message(bot, `${error.message}`, msg.chat.id);
    }
});

bot.on('message', (msg) => {
    const chat_id: number = msg.chat.id;
    if (!msg.text?.includes('/')) {
        if (!msg.text?.includes(';')) {
            bot_services.send_message(bot, `Command is not true!`, chat_id);
        }

        const command: Array<string> = msg.text?.split(';') || [];
        if (
            command.length !==
            parseInt(command_bot[`${command[0]}_${command[1]}_length`])
        ) {
            bot_services.send_message(
                bot,
                command_bot[`${command[0]}_${command[1]}_rule`] ||
                    'Command is not valid',
                chat_id
            );
        } else {
            const command_name = `${command[0]}_${command[1]}`;
            const name = `telegram_${msg.chat.first_name}_${msg.chat.last_name}`;
            command_bot[command_name](
                command[3],
                command[4],
                command[2],
                chat_id,
                name
            );
        }
    }
});
