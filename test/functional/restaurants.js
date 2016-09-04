'use strict';

require('../testHelpers');

const Promise = require('bluebird');

let Restaurant;

exports.lab = Lab.script();

const server = Server.server;

describe('Restaurant resources', () => {

  const sampleRestaurant = {
    name: 'Subway'
  };

  before((done) => {
    Server.initialize()
    .then(() => {
      Restaurant = server.models.Restaurant;
      return done();
    });
  });

  describe('GET /restaurants', () => {

    let restaurantInstance;

    function callServer(test) {
      return server.inject({
        method: 'GET',
        url: '/restaurants'
      }, test);
    }

    before((done) => {
      Restaurant.create(sampleRestaurant)
      .then((restaurant) => {
        restaurantInstance = restaurant;
        return done();
      });
    });

    afterEach((done) => {
      Restaurant.findAll.restore && Restaurant.findAll.restore();
      return done();
    });

    after((done) => {
      restaurantInstance.destroy()
      .then(() => done());
    });

    it('should return a list of restaurants when this endpoint is used correctly', (done) => {
      return callServer((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal([{
          id: restaurantInstance.id,
          name: 'Subway'
        }]);
        return done();
      });
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Restaurant, 'findAll').returns(Promise.reject('GET /restaurants stubbed error'));
      return callServer((response) => {
        expect(response.statusCode).to.equal(500);
        expect(response.result).to.equal({
          error: 'Internal Server Error',
          message: 'An internal server error occurred',
          statusCode: 500
        });
        return done();
      });
    });
  });

  describe('POST /restaurants', () => {

    const validPayload = {
      name: 'Subway'
    };

    function callServer(payload, test) {
      return server.inject({
        method: 'POST',
        url: '/restaurants',
        payload
      }, test);
    }

    afterEach((done) => {
      Restaurant.create.restore && Restaurant.create.restore();
      return done();
    });

    it('should return a new restaurant when this endpoint is used correctly', (done) => {
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.equal({
          id: response.result.id,
          name: 'Subway'
        });
        return Restaurant.findById(response.result.id)
        .then((restaurant) => restaurant.destroy())
        .then(() => done());
      });
    });

    describe('bad request', () => {

      it('should return a 400 if an invalid key is in the payload', (done) => {
        const invalidPayload = Object.assign({}, validPayload, {
          invalidKey: 'some value'
        });

        return callServer(invalidPayload, (response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.result).to.equal({
            error: 'Bad Request',
            message: '"invalidKey" is not allowed',
            statusCode: 400,
            validation: {
              keys: ['invalidKey'],
              source: 'payload'
            }
          });
          return done();
        });
      });
    });

    it('should return a 409 if a restaurant already exists with the same name', (done) => {
      let restaurantInstance;

      Restaurant.create(sampleRestaurant)
      .then((restaurant) => {
        restaurantInstance = restaurant;
        return callServer(validPayload, (response) => {
          expect(response.statusCode).to.equal(409);
          expect(response.result).to.equal({
            error: 'Conflict',
            message: 'Restaurant already exist',
            statusCode: 409
          });
          return restaurantInstance.destroy();
        });
      })
      .then(() => done());
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Restaurant, 'create').returns(Promise.reject('POST /restaurants stubbed error'));
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(500);
        expect(response.result).to.equal({
          error: 'Internal Server Error',
          message: 'An internal server error occurred',
          statusCode: 500
        });
        return done();
      });
    });
  });
});
