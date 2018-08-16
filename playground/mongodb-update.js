const { MongoClient, ObjectID } = require('mongodb');

// Connect to database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  // Throw error in case of failed connection
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // Get reference to database
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b75d6883756011abe9ff012')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then(res => {
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b75d322b69ccf2bacb23a8d')
  }, {
    $set: {
      name: 'Aleksandar'
    },
    $inc: {
      age: 3
    }
  }, {
    returnOriginal: false
  })
  .then(res => {
    console.log(res);
  });

  // Disconnect from database
  // client.close();
});