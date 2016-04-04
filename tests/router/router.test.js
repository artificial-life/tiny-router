'use strict'
let Router = require('./router.js')

describe('Router', () => {
	let router;

	beforeEach(() => {
		router = new Router();
		router.setDefaultCallback((data) => {
			console.log('send data into socket', data);
		});
	});
	it('is instanceof Router', () => {
		expect(router).to.be.an.instanceof(Router);
	});

	it('default delimiter is dot', () => {
		expect(router.delimiter).to.equal('.');
	});
	describe('addRoute', () => {
		it('simple route is string', () => {
			router.addRoute('my.little.route');
			expect(router).to.have.deep.property('routes.my\\.little\\.route.data')
				.that.is.an('string')
		});

		it('route with "*" mask is array', () => {
			router.addRoute('my.*.route');
			expect(router).to.have.deep.property('routes.my\\.*\\.route.data')
				.that.is.an('array')
		});

		it('route with "#" mask is array', () => {
			router.addRoute('my.#.route');
			expect(router).to.have.deep.property('routes.my\\.#\\.route.data')
				.that.is.an('array')
		});

		it('multiple subscriptions increase count', () => {
			router.addRoute('my.little.route');
			expect(router).to.have.deep.property('routes.my\\.little\\.route.count')
				.that.is.equal(1);
			router.addRoute('my.little.route');
			expect(router).to.have.deep.property('routes.my\\.little\\.route.count')
				.that.is.equal(2);
		});
	});
	describe('removeRoute', () => {
		it('removal of single route, removes it from route list', () => {
			router.addRoute('my.little.route');
			router.removeRoute('my.little.route');
			expect(router).to.not.have.deep.property('routes.my\\.little\\.route');
		});
		it('removal of route with count 2 or more, dec. count property ', () => {
			//add route x2
			router.addRoute('my.little.route');
			router.addRoute('my.little.route');
			router.removeRoute('my.little.route');

			expect(router).to.have.deep.property('routes.my\\.little\\.route.count')
				.that.is.equal(1);

		});
	});
	describe('parse', () => {
		it('parsing on simple routes', () => {
			let r = false;
			router.addRoute('my.other.route');
			router.addRoute('my.little.route');
			router.addRoute('my.third.route');

			router.setDefaultCallback((event, data) => {
				r = data.success;
			});

			router.parse('my.little.route', {
				success: true
			});
			expect(r).to.equal(true);
		});

		it('parsing on  routes with mask', () => {
			let r = false;
			router.addRoute('my.other.route');
			router.addRoute('my.little.route');
			router.addRoute('my.*.route');

			router.setDefaultCallback((event, data) => {
				console.log(event, data);
				r = data.success;
			});

			router.parse('my.big.route', {
				success: true
			});
			expect(r).to.equal(true);
		});
		it('parsing on  routes with multiple masks', () => {
			let r = false;
			router.addRoute('my.other.route');
			router.addRoute('my.little.route');
			router.addRoute('my.*.route.*');

			router.setDefaultCallback((event, data) => {
				console.log(event, data);
				r = data.success;
			});

			router.parse('my.big.route.ZZ', {
				success: true
			});
			expect(r).to.equal(true);
		});

	});
});