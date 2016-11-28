import querystring from 'querystring';
import { parse as parseUrl } from 'url';
import setHeaders from './set_headers';
const handleMultiKibanaIndex = require('./handle_multi_kibana_index');

export default function mapUri(server, prefix) {

  const config = server.config();
  return function (request, done) {
    let path = request.path.replace('/elasticsearch', '');

    if (config.get('elasticsearch.handleMultiIndices')) {
      path = handleMultiKibanaIndex(server, request, path);
    }

    let url = config.get('elasticsearch.url');
    const { host } = parseUrl(url);
    if (path) {
      if (/\/$/.test(url)) url = url.substring(0, url.length - 1);
      url += path;
    }
    const query = querystring.stringify(request.query);
    if (query) url += '?' + query;
    // We want the host of elasticsearch rather than of Kibana
    const headers = {
      ...request.headers,
      host
    };
    const customHeaders = setHeaders(headers, config.get('elasticsearch.customHeaders'));
    done(null, url, customHeaders);
  };
};
