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
    res.send(doc);
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
    res.send(JSON.stringify(todo, undefined, 2));
  })
  .catch(err => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});