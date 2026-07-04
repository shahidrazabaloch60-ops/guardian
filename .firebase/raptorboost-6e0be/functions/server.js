const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrraptorboost6e0be = onRequest({"region":"us-central1"}, (req, res) => server.then(it => it.handle(req, res)));
  