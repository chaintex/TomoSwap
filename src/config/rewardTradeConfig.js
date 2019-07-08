const RewardConfig = {
    transaction: {
        rules: [
            {
                min: 1,
                max: 1,
                value: 100,
            },
            {
                min: 2,
                max: 5,
                value: 70,
            },
            {
                min: 6,
                max: 10,
                value: 50,
            },
            {
                min: 11,
                max: 20,
                value: 30,
            }
        ],
        unit: '$'
    },
    volume: {
        rules: [
            {
                min: 1,
                max: 1,
                value: 100,
            },
            {
                min: 2,
                max: 5,
                value: 70,
            },
            {
                min: 6,
                max: 10,
                value: 50,
            },
            {
                min: 11,
                max: 20,
                value: 30,
            }
        ],
        unit: '$'
    }
}

export default RewardConfig;