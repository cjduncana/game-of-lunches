'use strict';

require('../testHelpers');

const Promise = require('bluebird');

let Vote;

exports.lab = Lab.script();

const server = Server.server;

describe('Vote resources', () => {

  const sampleVote = {
    name: 'Subway'
  };

  before((done) => {
    Server.initialize()
    .then(() => {
      Vote = server.models.Vote;
      return done();
    });
  });

  describe('GET /votes', () => {

    let voteInstance;

    function callServer(test) {
      return server.inject({
        method: 'GET',
        url: '/votes'
      }, test);
    }

    before((done) => {
      Vote.create(sampleVote)
      .then((vote) => {
        voteInstance = vote;
        return done();
      });
    });

    afterEach((done) => {
      Vote.findAll.restore && Vote.findAll.restore();
      return done();
    });

    after((done) => {
      voteInstance.destroy()
      .then(() => done());
    });

    it('should return a list of votes when this endpoint is used correctly', (done) => {
      return callServer((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal([{
          id: voteInstance.id,
          name: 'Subway'
        }]);
        return done();
      });
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Vote, 'findAll').returns(Promise.reject('GET /votes stubbed error'));
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

  describe('POST /votes', () => {

    const validPayload = {
      name: 'Subway'
    };

    function callServer(payload, test) {
      return server.inject({
        method: 'POST',
        url: '/votes',
        payload
      }, test);
    }

    afterEach((done) => {
      Vote.create.restore && Vote.create.restore();
      return done();
    });

    it('should return a new vote when this endpoint is used correctly', (done) => {
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.equal({
          id: response.result.id,
          name: 'Subway'
        });
        return Vote.findById(response.result.id)
        .then((vote) => vote.destroy())
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

    it('should return a 409 if a vote already exists with the same name', (done) => {
      let voteInstance;

      Vote.create(sampleVote)
      .then((vote) => {
        voteInstance = vote;
        return callServer(validPayload, (response) => {
          expect(response.statusCode).to.equal(409);
          expect(response.result).to.equal({
            error: 'Conflict',
            message: 'Vote already exist',
            statusCode: 409
          });
          return voteInstance.destroy();
        });
      })
      .then(() => done());
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Vote, 'create').returns(Promise.reject('POST /votes stubbed error'));
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
