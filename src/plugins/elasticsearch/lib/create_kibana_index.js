const SetupError = require('./setup_error');
const format = require('util').format;
module.exports = function (server, kibanaIndex) {
  const client = server.plugins.elasticsearch.client;
  const index = kibanaIndex || server.config().get('kibana.index');

  function handleError(message) {
    return function (err) {
      throw new SetupError(server, message, err);
    };
  }

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
  })
  .catch(handleError('Unable to create Kibana index "<%= kibana.index %>"'))
  .then(function () {
    return client.cluster.health({
      waitForStatus: 'yellow',
      index: index
    })
    .catch(handleError('Waiting for Kibana index "<%= kibana.index %>" to come online failed.'));
  });
};
