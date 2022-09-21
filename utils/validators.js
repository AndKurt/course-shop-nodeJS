const { body } = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
  body('name')
    .isLength({ min: 2, max: 10 })
    .withMessage('Имя не может быть менее 2 символов')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Не корректный формат email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('Пользователь с таким email уже существует')
        }
      } catch (error) {
        console.log(error)
      }
    })
    .normalizeEmail(),
  body('password', 'Не верный формат пароля. Пароль должен быть не менее 2 символов')
    .isAlphanumeric()
    .isLength({ min: 2, max: 20 })
    .trim(),
  body('confirm')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароли не совпадают')
      }
      return true
    }),
]

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Не корректный формат email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (!user) {
          return Promise.reject('Пользователь с таким email не существует')
        }
      } catch (error) {
        console.log(error)
      }
    })
    .normalizeEmail(),
  body('password', 'Не верный пароль').isAlphanumeric().isLength({ min: 2, max: 20 }).trim(),
]
