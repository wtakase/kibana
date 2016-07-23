const checkKibanaIndex = require('./check_kibana_index');

module.exports = function (server, headers, path) {

  let config = server.config();

  let userIndexProperty = '';

  // Group property is preferred
  if (config.get('elasticsearch.proxyGroupHeader') in headers) {
    userIndexProperty = headers[config.get('elasticsearch.proxyGroupHeader')];
  } else if (config.get('elasticsearch.proxyUserHeader') in headers) {
    userIndexProperty = headers[config.get('elasticsearch.proxyUserHeader')];
  }

  if (userIndexProperty) {
    // Add user property to `kibana.index`
    let originalIndex = config.get('kibana.index');
    let replacedIndex = originalIndex + '.' + userIndexProperty;

    if (path.indexOf(originalIndex) > -1 && path.indexOf(replacedIndex) === -1) {
      // TODO(wtakase): This replaces whether it's kibana.index or not
      path = path.replace(originalIndex, replacedIndex);
      server.log(['plugin:elasticsearch', 'debug'], 'Replace kibana.index "' + originalIndex + '" with "' + replacedIndex + '"');
      server.log(['plugin:elasticsearch', 'debug'], 'Replaced path: ' + path');

      // Check replaced kibana index exists
      checkKibanaIndex(server, replacedIndex);
    }
  }

  return path;
};
