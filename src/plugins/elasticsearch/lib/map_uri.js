const querystring = require('querystring');
const resolve = require('url').resolve;
const handleMultiKibanaIndices = require('./handle_multi_kibana_indices');
module.exports = function mapUri(server, prefix) {
  const config = server.config();
  return function (request, done) {
    let path = request.path.replace('/elasticsearch', '');

    if (config.get('elasticsearch.handleMultiIndices')) {
      path = handleMultiKibanaIndices(server, request, path);
    }

    let url = config.get('elasticsearch.url');
    if (path) {
      if (/\/$/.test(url)) url = url.substring(0, url.length - 1);
      url += path;
    }
    const query = querystring.stringify(request.query);
    if (query) url += '?' + query;
    done(null, url);
  };
};
