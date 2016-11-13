import express from 'express';
import open from 'open';
import path from 'path';
import compression from 'compression';
import raven from 'raven';

/* eslint-disable no-console */

function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned and optionally
  // displayed to the user for support.
  debugger // eslint-disable-line
  res.statusCode = 500;
  res.end(res.sentry + '\n');
  next();
}

const port = 3000;
const app = express();

// The request handler must be the first item
app.use(raven.middleware.express.requestHandler('https://ef6873056df2411b8551ca2e4ee72108:33cca985b2e0477cb8b02a145a087ba9@sentry' +
    '.io/114112'));

app.use(compression());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/users', function (req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {
      "id": 1,
      "firstName": "Bob",
      "lastName": "Smith",
      "email": "bob@gmail.com"
    }, {
      "id": 2,
      "firstName": "Tammy",
      "lastName": "Norton",
      "email": "tnorton@yahoo.com"
    }, {
      "id": 3,
      "firstName": "Tina",
      "lastName": "Lee",
      "email": "lee.tina@hotmail.com"
    }
  ]);
});

// The error handler must be before any other error middleware
app.use(raven.middleware.express.errorHandler('https://ef6873056df2411b8551ca2e4ee72108:33cca985b2e0477cb8b02a145a087ba9@sentry' +
    '.io/114112'));

// Optional fallthrough error handler
app.use(onError);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
