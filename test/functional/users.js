'use strict';

require('../testHelpers');

const Promise = require('bluebird');

let User;

exports.lab = Lab.script();

const server = Server.server;

describe('User resources', () => {

  const sampleUser = {
    name: 'Adam Connover'
  };

  before((done) => {
    Server.initialize()
    .then(() => {
      User = server.models.User;
      return done();
    });
  });

  describe('GET /users', () => {

    let userInstance;

    function callServer(test) {
      return server.inject({
        method: 'GET',
        url: '/users'
      }, test);
    }

    before((done) => {
      User.create(sampleUser)
      .then((user) => {
        userInstance = user;
        return done();
      });
    });

    afterEach((done) => {
      User.findAll.restore && User.findAll.restore();
      return done();
    });

    after((done) => {
      userInstance.destroy()
      .then(() => done());
    });

    it('should return a list of users when this endpoint is used correctly', (done) => {
      return callServer((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal([{
          id: userInstance.id,
          name: 'Adam Connover'
        }]);
        return done();
      });
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(User, 'findAll').returns(Promise.reject('GET /users stubbed error'));
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

  describe('POST /users', () => {

    const validPayload = {
      name: 'Adam Connover'
    };

    function callServer(payload, test) {
      return server.inject({
        method: 'POST',
        url: '/users',
        payload
      }, test);
    }

    afterEach((done) => {
      User.create.restore && User.create.restore();
      return done();
    });

    it('should return a new user when this endpoint is used correctly', (done) => {
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.equal({
          id: response.result.id,
          name: 'Adam Connover'
        });
        return User.findById(response.result.id)
        .then((user) => user.destroy())
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

    it('should return a 409 if a user already exists with the same name', (done) => {
      let userInstance;

      User.create(sampleUser)
      .then((user) => {
        userInstance = user;
        return callServer(validPayload, (response) => {
          expect(response.statusCode).to.equal(409);
          expect(response.result).to.equal({
            error: 'Conflict',
            message: 'User already exist',
            statusCode: 409
          });
          return userInstance.destroy();
        });
      })
      .then(() => done());
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(User, 'create').returns(Promise.reject('POST /users stubbed error'));
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
