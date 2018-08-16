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

  // QUERYING BY _ID
  // db.collection('Todos').find({
  //   _id: new ObjectID('5b75cb38962b1817b0f8a54a')
  // }).toArray()
  //   .then((docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });

  // COUNTING DOCUMENTS IN COLLECTION
  // db.collection('Todos').find().count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });


  // QUERYING BY NAME
  db.collection('Users').find({name: 'Alex'}).toArray()
    .then(docs => {
      console.log('Users:');
      console.log(JSON.stringify(docs, undefined, 2));
    }, err => {
      console.log('Unable to find document with that name');
    });
  
  // Disconnect from database
  // client.close();
});