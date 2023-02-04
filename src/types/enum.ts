enum DEPOSIT_STATUS {
    'PENDING' = 'Pending',
    'COMPLETED' = 'Completed',
    'CANCELED' = 'Canceled'
}

enum WITHDRAW_STATUS {
    'CONFIRMED' = 'Confirmed',
    'PENDING' = 'Pending',
    'COMPLETED' = 'Completed',
    'CANCELED' = 'Canceled'
}

enum CONTRACT_STATUS {
    'CONFIRMED' = 'Confirmed',
    'PENDING' = 'Pending',
    'COMPLETED' = 'Completed',
    'CANCELED' = 'Canceled'
}

enum CONTRACT_CYCLE {
    '1_MONTH' = 30,
    '3_MONTH' = 90,
    '6_MONTH' = 180,
    '12_MONTH' = 360,
    '18_MONTH' = 540
}

export { DEPOSIT_STATUS, WITHDRAW_STATUS, CONTRACT_STATUS, CONTRACT_CYCLE };
