const { Router } = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')
require('dotenv').config()

const User = require('../models/user')
const regEmail = require('../emails/registration')
const resetPass = require('../emails/resetPass')
const { loginValidators, registerValidators } = require('../utils/validators')

const OAuth2 = google.auth.OAuth2
const router = new Router()

//OAuth2 configuration
const oauth2Client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_SECRET_KEY)

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
})

const accessToken = oauth2Client.getAccessToken()

const authObject = {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_EMAIL,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_SECRET_KEY,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: accessToken,
  },
}

let transporter = nodemailer.createTransport(authObject)
// -----------------------------------------------------

router.get('/login', async (req, res) => {
  try {
    res.render('./auth/login', {
      title: 'Авторизация',
      isLogin: true,
      loginError: req.flash('loginError'),
      registerError: req.flash('registerError'),
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/auth/login#login')
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#login')
    }

    const candidate = await User.findOne({ email })
    const isSamePassword = await bcrypt.compare(password, candidate.password)

    if (isSamePassword) {
      req.session.user = candidate
      req.session.isAuthenticated = true
      req.session.save((err) => {
        if (err) {
          throw err
        }
        res.redirect('/')
      })
    } else {
      req.flash('loginError', 'Не верный пароль')
      res.redirect('/auth/login#login')
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: {
        items: [],
      },
    })
    await user.save()
    res.redirect('/auth/login#login')

    transporter.sendMail(regEmail(email, name), (err, success) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Email sent success')
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/resetPass', {
    title: 'Забыли пароль?',
    error: req.flash('error'),
  })
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Чnо-то пошло не так, попробуйте позже')
        res.redirect('/auth/reset')
      }
      const token = buffer.toString('hex')

      const candidate = await User.findOne({ email: req.body.email })
      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await candidate.save()
        transporter.sendMail(resetPass(candidate.email, token))
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Пользователя с таким email не существует')
        res.redirect('/auth/reset')
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/resetPassForm', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token,
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Время жизни токена истекло')
      res.redirect('/auth/login')
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
