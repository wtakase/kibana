const createKibanaIndex = require('./create_kibana_index');
const migrateConfig = require('./migrate_config');

module.exports = function (server, req, path) {

  let headers = req.headers;
  let config = server.config();

  let replacedIndex = '';
  let remoteUser = '';
  if (config.get('elasticsearch.proxyUserHeader') in headers) {
    remoteUser = headers[config.get('elasticsearch.proxyUserHeader')];
    try {
      let remoteUserSession = req.yar.get(remoteUser);
      replacedIndex = remoteUserSession.key;
    } catch (err) {
      replacedIndex = config.get('kibana.index') + '_' + remoteUser;
      req.yar.set(remoteUser, { key: replacedIndex });
    }
  }

  if (replacedIndex) {
    let originalIndex = config.get('kibana.index');

    if (path.indexOf(originalIndex) > -1 && path.indexOf(replacedIndex) === -1) {
      let reOriginalIndex = RegExp('(\\/)' + originalIndex + '(\\/|$)');
      path = path.replace(reOriginalIndex, "$1" + replacedIndex + "$2");
      server.log(['plugin:elasticsearch', 'debug'], 'Replace kibana.index "' + originalIndex + '" with "' + replacedIndex + '"');
      server.log(['plugin:elasticsearch', 'debug'], 'Replaced path: ' + path);

      // Check replaced kibana index exists
      let client = server.plugins.elasticsearch.client;
      client.indices.exists({index: replacedIndex}).then(function (exists) {
        if (exists !== true) {
          return createKibanaIndex(server, replacedIndex);
        } else {
          // Ignore 409 error: 'document_already_exists_exception'
          return migrateConfig(server, replacedIndex, [409]);
        }
      });
    }
  }

  return path;
};
