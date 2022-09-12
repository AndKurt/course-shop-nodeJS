const { Router } = require('express')
const Order = require('../models/order')
const auth = require('../middlewares/auth')

const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      'user.userId': req.user._id,
    }).populate('user.userId')

    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
      orders: orders.map((e) => ({
        ...e._doc,
        price: e.courses.reduce((acc, e) => {
          return (acc += e.count * e.course.price)
        }, 0),
      })),
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId')
    const courses = user.cart.items.map((e) => ({
      count: e.count,
      course: { ...e.courseId._doc },
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    })

    await order.save()
    await req.user.clearCarts()

    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
