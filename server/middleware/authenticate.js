const { User } = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  // ASYNC / AWAIT
  (async function auth () {
    let user;
    try {
      user = await User.findByToken(token);
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).send('User not found');
    }
  })();
  
  // PROMISES
  // User.findByToken(token)
  //   .then(user => {
  //     if (!user) {
  //       return Promise.reject();
  //     }
  //     req.user = user;
  //     req.token = token;
  //     next();
  //   })
  //   .catch(err => {
  //     res.status(401).send();
  //   });

};

module.exports = {
  authenticate
}