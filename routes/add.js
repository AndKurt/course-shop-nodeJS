const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middlewares/auth')

const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true,
  })
})

router.post('/', auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    ownerId: req.user,
  })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
