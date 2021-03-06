const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// OVERRIDING Schema method to return only id and email 
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// Instance method for generating authentication token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  await user.save();
  return token;
};

// Remove Token instance method
UserSchema.methods.removeToken = function (token)  {
  const user = this;
  
  return user.update({
    $pull: {
      tokens: { token }
    }
  });
}

// Find By Token Model method
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function (next) {
  const user = this;

  // If password is modified, generate salt and hash password
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Find User by email
UserSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  const user = await User.findOne({ email });
  // If user not found, reject it
  if (!user) { return Promise.reject(); } 
  // If it exists, check password
  return new Promise((resolve, reject ) => {
    bcrypt.compare(password, user.password, (err, res) => {
      res ? resolve(user) : reject();
    });
  });

  // Find a user via email
  // return User.findOne({email})
  //   .then(user => {
  //     // If user doesnt exist, reject
  //     if (!user) {
  //       return Promise.reject();
  //     }
  //     // If exists, check password
  //     return new Promise((resolve, reject) => {
  //       bcrypt.compare(password, user.password, (err, res) => {
  //         if (res) {
  //           resolve(user);
  //         } else {
  //           reject();
  //         }
  //       });
  //     });
  //   })
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
}