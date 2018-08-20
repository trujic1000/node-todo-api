const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.send(JSON.stringify(doc, undefined, 2));
  }, err => {
    res.status(400).send(e);
  });
  
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});