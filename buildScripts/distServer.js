import express from 'express';
import open from 'open';
import path from 'path';
import compression from 'compression';
import raven from 'raven';
import config from '../webpack.config.prod';

/* eslint-disable no-console */

function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned and optionally
  // displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
  next();
}

const port = 3000;
const app = express();

// The request handler must be the first item
app.use(raven.middleware.express.requestHandler(config.sentryDns));

app.use(compression());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// The error handler must be before any other error middleware
app.use(raven.middleware.express.errorHandler(config.sentryDns));

// Optional fallthrough error handler
app.use(onError);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
