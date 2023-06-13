const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

});


const Book = model('book', bookSchema)

module.exports = Book