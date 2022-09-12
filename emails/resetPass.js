module.exports = (email, token) => ({
  from: process.env.GMAIL_EMAIL,
  to: email,
  subject: 'Восстановление пароля в магазине "Купи курс"',
  text: `
  <h1>Вы забыли пароль?</h1>
  <p>Если нет, то проигнорируйте данное письмо</p>
  <p>Иначе перейдите на форму восстановления пароля:</p>
  <a href='${process.env.APP_BASE_URL}/auth/password/${token}'>Перейти в магазин для восстановления пароля</a>
  <hr/>
  <a href='${process.env.APP_BASE_URL}'>Посетите наш магазин прямо сейчас</a>`,
})
