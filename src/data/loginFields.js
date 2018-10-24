export const fields = [
    {
        field: 'username',
        content: 'Username'
    },
    {
        field: 'password',
        content: 'Password',
        type: 'password'
    },
];

export const validations = [
    {
        field: 'username',
        method: 'isEmpty',
        validWhen: false,
        message: 'Username is required.'
    },
    {
        field: 'username',
        method: 'isLength',
        args: [{ min: 3, max: 40 }],
        validWhen: true,
        message: 'Username must have between 3 and 40 characters.'
    },
    {
        field: 'password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Password is required.'
    },
    {
        field: 'password',
        method: 'isLength',
        args: [{ min: 8,  max: 200 }],
        validWhen: true,
        message: 'Password must have between 8 and 200 characters.'
    }
];