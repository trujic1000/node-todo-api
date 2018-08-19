const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// const id = '5b77082b4505e51816336f4b11';

// if (!ObjectID.isValid(id)){
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log(todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log(todo);
// });

// Todo.findById(id).then(todo => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log(todo);
// }).catch(err => {
//   console.log(err);
// });

const userId = '5b770c73ebd201d81e8c44b9';

if (!ObjectID.isValid(userId)) {
  return console.log('User Id is not valid!');
}

User.findById({
  _id: userId
})
  .then(user => {
    if (!user) {
      return console.log('User not found!');
    }
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch(err => {
    console.log(err);
  });