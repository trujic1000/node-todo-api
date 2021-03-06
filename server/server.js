require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(doc => {
    res.send(JSON.stringify(doc, undefined, 2));
  }, err => {
    res.status(400).send(e);
  });
  
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({todos});
  }, err => {
    res.status(400).send(err);
  });
});

// GET /todos/1234
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  // If ID is not valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid Id');
  }
  // If it is valid, find it and return
  Todo.findById(id)
  .then(todo => {
    // If not found
    if (!todo) {
      return res.status(404).send('todo not found');
    }
    // If found
    res.send({todo});
  })
  .catch(err => {
    res.status(400).send();
  });
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    })
    .catch(err => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  // "DESTRUCTURING" req.body, but only properties that could be changed by user
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch(err => {
      res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  // USING ASYNC / AWAIT
  (async function saveUser (){
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (err) {
      res.status(400).send('Email already exists, try new one!');
    }
  })();

  // USING PROMISES
  // user.save()
  //   .then(() => {
  //     return user.generateAuthToken();
  //   })
  //   .then(token => {
  //     res.header('x-auth', token).send(user);
  //   })
  //   .catch(err => res.status(400).send());

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  // Grabbing email and password from request
  const { email, password } = req.body;
  // ASYNC / AWAIT
  (async function findUser () {
    try {
      // Find user by Credentials
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (err) {
      res.status(400).send('User not found!');
    }
  })();

  // User.findByCredentials(email, password)
  //   .then(user => {
  //     // Generate token and send it to header
  //     return user.generateAuthToken().then(token => {
  //       res.header('x-auth', token).send(user);
  //     });
  //   })
  //   .catch(err => {
  //     res.status(400).send();
  //   });
});

app.delete('/users/me/token', authenticate, (req, res) => {

  (async function removeToken () {
    try {
      await req.user.removeToken(req.token);
      res.status(200).send('Token sucessfully deleted');
    } catch (err) {
      res.status(400).send('Token not deleted');
    }
  })();
  
  // req.user.removeToken(req.token)
  //   .then(() => {
  //     res.status(200).send();
  //   }, () => {
  //     res.status(400).send();
  //   });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});