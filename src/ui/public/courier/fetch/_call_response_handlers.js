define(function (require) {
  return function CourierFetchCallResponseHandlers(Private, Promise) {
    var ABORTED = Private(require('ui/courier/fetch/_req_status')).ABORTED;
    var INCOMPLETE = Private(require('ui/courier/fetch/_req_status')).INCOMPLETE;
    var notify = Private(require('ui/courier/fetch/_notifier'));

    var SearchTimeout = require('ui/errors').SearchTimeout;
    var RequestFailure = require('ui/errors').RequestFailure;
    var ShardFailure = require('ui/errors').ShardFailure;

    function callResponseHandlers(requests, responses) {
      return Promise.map(requests, function (req, i) {
        if (req === ABORTED || req.aborted) {
          return ABORTED;
        }

        var resp = responses[i];

        if (resp.timed_out) {
          notify.warning(new SearchTimeout());
        }

        if (resp._shards && resp._shards.failed) {
          notify.warning(new ShardFailure(resp));
        }

        function progress() {
          if (req.isIncomplete()) {
            return INCOMPLETE;
          }

          req.complete();
          return resp;
        }

        if (resp.error) {
          if (req.filterError(resp)) {
            return progress();
          } else if (resp.error.type === "index_not_found_exception") {
            // TODO(wtakase): User specific kibna.index will be created at the first access,
            //                so user may get `index_not_found_exception` error for the first time.
            //                Currently the only solution is to reload the page.
            return req.handleFailure(new RequestFailure(null, {"error": "No index found. Please reload again."}));
          } else {
            return req.handleFailure(new RequestFailure(null, resp));
          }
        }

        return Promise.try(function () {
          return req.transformResponse(resp);
        })
        .then(function () {
          resp = arguments[0];
          return req.handleResponse(resp);
        })
        .then(progress);
      });
    }

    return callResponseHandlers;
  };
});
