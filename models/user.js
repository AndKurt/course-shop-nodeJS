const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
})

// стрелочная функция тут работать не будет
userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items]
  const courseIndex = items.findIndex((e) => e.courseId.toString() === course._id.toString())

  if (courseIndex >= 0) {
    items[courseIndex].count = items[courseIndex].count + 1
  } else {
    items.push({
      courseId: course._id,
      count: 1,
    })
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const index = items.findIndex((e) => e.courseId.toString() === id)

  if (items[index].count === 1) {
    items = items.filter((e) => e.courseId.toString() !== id)
  } else {
    items[index].count--
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCarts = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('User', userSchema)
