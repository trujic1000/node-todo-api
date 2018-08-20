const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}) - removes everything

// Todo.remove({}).then(res => {
//   console.log(res);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5b79f9d5ee052e5a905d4e94')
  .then(todo => {
    console.log(todo);
  });