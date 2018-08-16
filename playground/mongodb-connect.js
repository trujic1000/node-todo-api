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

  // Insert new doc into Todos
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert todo');
  //   }

  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  // Insert new doc into Users
  // db.collection('Users').insertOne({
  //   name: 'Mike',
  //   age: 22,
  //   location: 'Mason City'
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to add user');
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  // Disconnect from database
  client.close();
});