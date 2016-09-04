'use strict';

require('../testHelpers');

const Promise = require('bluebird');

let Poll;

exports.lab = Lab.script();

const server = Server.server;

describe('Poll resources', () => {

  const samplePoll = {
    numberOfRestaurants: 3
  };

  before((done) => {
    Server.initialize()
    .then(() => {
      Poll = server.models.Poll;
      return done();
    });
  });

  describe('GET /polls', () => {

    let pollInstance;

    function callServer(test) {
      return server.inject({
        method: 'GET',
        url: '/polls'
      }, test);
    }

    before((done) => {
      Poll.create(samplePoll)
      .then((poll) => {
        pollInstance = poll;
        return done();
      });
    });

    afterEach((done) => {
      Poll.findAll.restore && Poll.findAll.restore();
      return done();
    });

    after((done) => {
      pollInstance.destroy()
      .then(() => done());
    });

    it('should return a list of polls when this endpoint is used correctly', (done) => {
      return callServer((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal([{
          id: pollInstance.id,
          numberOfRestaurants: 3,
          active: true
        }]);
        return done();
      });
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Poll, 'findAll').returns(Promise.reject('GET /polls stubbed error'));
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

  describe('POST /polls', () => {

    const validPayload = {
      numberOfRestaurants: 3
    };

    function callServer(payload, test) {
      return server.inject({
        method: 'POST',
        url: '/polls',
        payload
      }, test);
    }

    afterEach((done) => {
      Poll.createPoll.restore && Poll.createPoll.restore();
      return done();
    });

    it('should return a new poll when this endpoint is used correctly', (done) => {
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.equal({
          id: response.result.id,
          numberOfRestaurants: 3,
          active: true
        });
        return Poll.findById(response.result.id)
        .then((poll) => poll.destroy())
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

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Poll, 'createPoll').returns(Promise.reject('POST /polls stubbed error'));
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
