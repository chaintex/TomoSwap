const RewardConfig = {
    transaction: {
        rules: [
            {
                min: 1,
                max: 1,
                value: 150,
            },
            {
                min: 2,
                max: 5,
                value: 75,
            },
            {
                min: 6,
                max: 10,
                value: 50,
            },
            {
                min: 11,
                max: 15,
                value: 25,
            }
        ],
        unit: '$'
    },
    volume: {
        rules: [
            {
                min: 1,
                max: 1,
                value: 150,
            },
            {
                min: 2,
                max: 5,
                value: 75,
            },
            {
                min: 6,
                max: 10,
                value: 50,
            },
            {
                min: 11,
                max: 15,
                value: 25,
            }
        ],
        unit: '$'
    },
    constant: {
        rules: [
            {
                min: 1,
                max: 1,
                value: 500,
            },
            {
                min: 2,
                max: 2,
                value: 300,
            },
            {
                min: 3,
                max: 3,
                value: 200,
            }
        ],
        unit: '$'
    }
}

export default RewardConfig;