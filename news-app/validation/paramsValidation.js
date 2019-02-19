const { check } = require('express-validator/check');

const validateNewsBody = () => {
    return [
        check('url').isURL(),
        check('name').isLength({ min: 3 })
    ];
}

const validateUserBody = () => {
    return [
        check('email').isEmail()
    ];
}

const validateUserRegistrationBody = () => {
    return [
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        check('password2').isLength({ min: 6 })
    ];
}

module.exports = {validateNewsBody, validateUserBody, validateUserRegistrationBody};