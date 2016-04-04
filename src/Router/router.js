'use strict'

const default_delimiter = '.';
const mask_chars = ['*', '#'];

class TinyRouter {
  constructor(params) {
    this.delimiter = params.delimiter || default_delimiter;
    this.routes = {};
  }
  setDefaultCallback(callback) {
    this.default_callback = callback;
  }
  addRoute(route, callback) {
    if (!_.isString(route)) throw new Error('Route must be string');

    let _callback = _.isFunction(callback) ? callback : this.default_callback;
    let route_data = this.hasMask(route) ? route.split(this.delimiter) : route;

    return route_id;
  }
  hasMask(route_string) {
    let result = false;

    _.forEach(mask_chars, (char) => {
      if (~route_string.indexOf(char)) return true;
      result = true;
      return false;
    });

    return result;
  }
  removeRoute(route_id) {

  }
  removeAll() {

  }
  parse(event) {

  }
}

module.exports = TinyRouter;