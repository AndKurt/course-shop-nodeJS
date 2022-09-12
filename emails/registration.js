module.exports = (email, name) => ({
  from: process.env.GMAIL_EMAIL,
  to: email,
  subject: 'Создан аккаунт в магазине "Купи курс"',
  text: `
  <h1><strong>${name}</strong>, добро пожаловать в магазин "Купи курс"</h1>
  <p>Вы успешно создали аккаунт с привязкой к email: ${email}</p>
  <hr/>
  <a href='${process.env.APP_BASE_URL}'>Посетите наш магазин прямо сейчас</a>`,
})
