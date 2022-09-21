const { body } = require('express-validator/check')

exports.registerValidators = [
  body('name').isLength({ min: 2, max: 10 }).withMessage('Имя не может быть менее 2 символов'),
  body('email').isEmail().withMessage('Не корректный формат email'),
  body('password', 'Не верный формат пароля. Пароль должен быть не менее 2 символов')
    .isAlphanumeric()
    .isLength({ min: 2, max: 20 }),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли не совпадают')
    }
    return true
  }),
]
