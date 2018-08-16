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

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'})
  //   .then(res => {
  //     console.log(res);
  //   });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'})
  //   .then(res => {
  //     console.log(res);
  //   });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false})
  //   .then(res => {
  //     console.log(res);
  //   }); 

  db.collection('Users').deleteMany({name: 'Alex'})
    .then(res => {
      console.log(res);
    });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b75d327669c022c3439b75b')})
    .then(res => {
      console.log(res);
    });
  
  // Disconnect from database
  // client.close();
});