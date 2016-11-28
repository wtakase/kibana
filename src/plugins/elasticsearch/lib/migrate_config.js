const upgrade = require('./upgrade_config');

module.exports = function (server, index, ignore) {
  const config = server.config();
  const client = server.plugins.elasticsearch.client;
  const options =  {
    index: index,
    type: 'config',
    body: {
      size: 1000,
      sort: [ { buildNum: { order: 'desc', ignore_unmapped: true } } ]
    }
  };

  return client.search(options).then(upgrade(server, index, ignore));
};


