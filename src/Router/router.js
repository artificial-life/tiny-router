'use strict'

let uuid = require('node-uuid');

const default_delimiter = '.';
const mask_chars = ['*', '#'];

class TinyRouter {
	constructor(params) {
		this.delimiter = params && params.delimiter || default_delimiter;
		this.routes = {};
	}
	setDefaultCallback(callback) {
		this.default_callback = callback;
	}
	addRoute(route) {
		if (!_.isString(route)) throw new Error('Route must be string');

		// let _callback = _.isFunction(callback) ? callback : this.default_callback;
		let route_data = this.hasMask(route) ? route.split(this.delimiter) : route;

		if (this.routes.hasOwnProperty(route)) {
			this.routes[route].count += 1;
		} else {
			this.routes[route] = {
				data: route_data,
				count: 1
			}
		};

		return true;
	}
	hasMask(route_string) {
		let result = false;

		_.forEach(mask_chars, (char) => {
			if (!~route_string.indexOf(char)) return true;
			result = true;
			return false;
		});

		return result;
	}
	removeRoute(route) {
		if (!this.routes.hasOwnProperty(route)) return true;

		if (this.routes[route].count > 1) {
			this.routes[route].count -= 1;
			return true;
		}

		_.unset(this.routes, route);
	}
	removeAll() {
		this.routes = {};
	}
	parse(event, data) {
		_.forEach(this.routes, (route) => {
			if (_.isString(route.data)) {
				if (route.data == event) {
					this.default_callback(event, data);
					return false;
				}
				return true;
			}

			let event_parts = event.split(this.delimiter);
			if (event_parts.length !== route.data.length) return true;
			let result = true;

			_.forEach(event_parts, (part, index) => {
				let route_part = route.data[index];
				if (route_part != '*' && part != route_part) {
					result = false;
					return false;
				}
			});

			if (result) {
				this.default_callback(event, data);
				return false;
			}
		});
	}

}

module.exports = TinyRouter;