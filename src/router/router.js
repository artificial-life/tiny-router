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
		let has_mask = this.hasMask(route);
		let route_data = has_mask ? route.split(this.delimiter) : route;

		if (this.routes.hasOwnProperty(route)) {
			this.routes[route].count += 1;
		} else {
			this.routes[route] = {
				data: route_data,
				count: 1
			};

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
		_.forEach(this.routes, (route, route_name) => {
			if (_.isString(route.data)) {
				if (route.data == event) {
					this.default_callback(event, data);
				}
				return true;
			}

			let event_parts = event.split(this.delimiter);
			if (event_parts.length !== route.data.length) return true;

			let result = true;
			let parts = [];

			_.forEach(event_parts, (part, index) => {
				let route_part = route.data[index];
				if (route_part != '*' && part != route_part) {
					result = false;
					return false;
				}
				if (route_part == "*") parts.push(part);
			});

			if (result) {
				if (parts.length) data._route_params = parts;
				this.default_callback(route_name, data);
			}
		});
	}

}

module.exports = TinyRouter;
