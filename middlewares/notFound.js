module.exports = (req, res, next) => {
  return res.status(404).render('404', {
    title: 'Страница не найдена',
  })
}
