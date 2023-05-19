const mongoose = require('mongoose');

const TodoListItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '請輸入標題'],
  },
  content: {
    type: String,
    required: [true, '請輸入內容'],
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
    required: [true, '請從 Low, Medium, High 中選一個優先度'],
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const todoListItem = mongoose.model('TodoList', TodoListItemSchema)
module.exports = todoListItem