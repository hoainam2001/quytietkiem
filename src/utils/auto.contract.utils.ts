import schedule from 'node-schedule';

import ContractServices from '../services/contract.services';
import { CONTRACT_STATUS } from '../types/enum';
import { precisionRound } from './functions.utils';
import axios from 'axios';
import { LoggerErr } from './logger';
const LogInfo = new LoggerErr('Info');
const logger: any = LogInfo.createLogger();

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'Asia/Bangkok';

const contract_services = new ContractServices();
const get_list_confirmed_contract = async () => {
    try {
        const contracts: Array<any> = [];
        const get_contracts = async () => {
            try {
                const contracts_find: Array<any> = await contract_services
                    .get_all_contract_by_status(CONTRACT_STATUS.CONFIRMED)
                    .then((result: any) => result?.data);
                contracts_find.forEach((contract: any) => {
                    contracts.push(contract?.dataValues);
                });
            } catch (error) {
                console.log(error);
            }
        };

        await get_contracts();
        return contracts;
    } catch (error: any) {
        logger.error(error.message);
    }
};

const handle_update = (
    day: number,
    principal: number,
    rate: number,
    id: number,
    cycle: number
) => {
    return new Promise((resolve, reject) => {
        const day_new = day + 1;
        const interest_rate = precisionRound(
            principal * precisionRound((rate / cycle) * day_new)
        );
        contract_services
            .update_contract(id, {
                number_of_days_taken: day_new,
                interest_rate: interest_rate
            })
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });
};

const handle_add_and_update = async (contract: any) => {
    try {
        const day = parseInt(contract.number_of_days_taken);
        const principal = parseInt(contract.principal);
        const rate = parseFloat(contract.rate);
        const cycle = parseInt(contract.cycle);
        const id_contract = parseInt(contract.id);

        if (day < cycle) {
            const completed_update = await handle_update(
                day,
                principal,
                rate,
                id_contract,
                cycle
            );
            logger.info(completed_update);
        } else {
            axios
                .put(`${process.env.URL}/admin/handleContract/${id_contract}`, {
                    status: CONTRACT_STATUS.COMPLETED
                })
                .then((result) => result.data)
                .then((final) => logger.info(final))
                .catch((err) => logger.error(err.message));
        }
    } catch (error) {
        console.log(error);
    }
};

const init_auto = async () => {
    try {
        const list_contract = await get_list_confirmed_contract().then(
            (value) => value
        );
        list_contract?.forEach((contract) => handle_add_and_update(contract));
    } catch (error) {
        logger.error(error);
    }
};

// setInterval(() => {
//     init_auto();
// }, 3000);

schedule.scheduleJob(rule, function () {
    init_auto();
});
