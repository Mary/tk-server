'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const usersRouter = require('./routes/users');
const activitiesRouter = require('./routes/activities');
const authRouter = require('./routes/auth');
const { localStrategy, jwtStrategy } = require('./strategies.js')

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', usersRouter);
app.use('/activities', activitiesRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error :((( </3 ' });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App sneakily listening to the mothership at:  ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start OH WHAT A WORLD');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
