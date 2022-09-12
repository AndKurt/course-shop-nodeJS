const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middlewares/auth')

const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('ownerId').select('price title img')
  // .populate - распарсит пользовальтеськие поля у пользователя в объекте курсов
  // .select - позволяет достать только определенные поля у объекта Course

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses,
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const course = await Course.findById(req.params.id)

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course,
  })
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
    })
    res.redirect('/courses')
  } catch (error) {
    console.log(error)
  }
})

router.post('/edit', auth, async (req, res) => {
  const { id } = req.body
  // Remoove ID from body object
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course,
  })
})

module.exports = router
