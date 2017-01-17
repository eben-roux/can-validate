var each = require('can-util/js/each/each');

var helpers = {
    'object': function (errors) {
        var resp = {};
        each(errors.map, function (errorList, key) {
            if (!resp[key]) {
                resp[key] = [];
            }
            each(errorList, function (error) {
                resp[key].push(error.message);
            });
        });
        return resp;
    },
    'flat': function (errors) {
        var resp = [];
        each(errors.list, function (error) {
            resp.push(error.message);
        });
        return resp;
    },
    'errors': function (errors) {
        return errors.list;
    },
};

// Takes errors and normalizes them into a map and a list.
var normalizeErrors = function (errors, key) {
    var resp = {
        map: {},
        list: []
    };

    // Attempt to use key for the map, otherwise, make one up
    if (!key) {
        key = '0';
    }

    // Only one error set, which we can assume was for a single property
    if (typeof errors === 'string') {
        var list = [];
        var errorItem = {message: errors, related: [key]};
        list.push(errorItem);
        resp.map[key] = list;
        resp.list = list;
    } else {
        each(errors, function (error) {
            if (error.related && error.related.length > 0) {
                each(error.related, function (relatedKey) {
                    if (!resp.map[relatedKey]) {
                        resp.map[relatedKey] = [];
                    }
                    resp.map[relatedKey].push(error);
                    resp.list.push(error);
                });
            }
        });
    }
    return resp;
};
module.exports = function (errors, format) {
    var normalized = normalizeErrors(errors);
    if (format) {
        if (helpers[format]) {
            return helpers[format](normalized);
        } else {
            return normalized;
        }
    } else {
        return normalized;
    }
};
