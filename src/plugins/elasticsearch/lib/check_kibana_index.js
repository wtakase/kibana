module.exports = function (server, index) {

  let client = server.plugins.elasticsearch.client;
  let config = server.config();

  function createIndex() {
    return client.indices.create({
      index: index,
      body: {
        settings: {
          number_of_shards: 1
        },
        mappings: {
          config: {
            properties: {
              buildNum: {
                type: 'string',
                index: 'not_analyzed'
              }
            }
          }
        }
      }
    });
  }

  function pushData() {
    return client.create({
      index: index,
      type: 'config',
      body: { buildNum: config.get('pkg.buildNum') },
      id: config.get('pkg.version')
    });
  }

  return client.indices.exists({index: index}).then(function (exists) {
    if (exists !== true) {
      server.log(['plugin:elasticsearch', 'info'], 'Index "' + index + '" not found. Create it');
      return createIndex(index).then(function () {
        return pushData(index);
      });
    }
  });

};
