'use strict';

require('../testHelpers');

const Promise = require('bluebird');

let Poll;
let Restaurant;
let User;
let Vote;

exports.lab = Lab.script();

const server = Server.server;

describe('Vote resources', () => {

  const samplePoll = {
    numberOfRestaurants: 3
  };
  const sampleRestaurant = {
    name: 'Subway'
  };
  const sampleUser = {
    name: 'Adam Connover'
  };
  const sampleVote = {
    rank: 1
  };

  before((done) => {
    Server.initialize()
    .then(() => {
      Poll = server.models.Poll;
      Restaurant = server.models.Restaurant;
      User = server.models.User;
      Vote = server.models.Vote;
      return done();
    });
  });

  describe('GET /votes', () => {

    let pollInstance;
    let restaurantInstance;
    let userInstance;
    let voteInstance;

    function callServer(test) {
      return server.inject({
        method: 'GET',
        url: '/votes'
      }, test);
    }

    before((done) => {
      Promise.props({
        poll: Poll.create(samplePoll),
        restaurant: Restaurant.create(sampleRestaurant),
        user: User.create(sampleUser)
      })

      .then(({ poll, restaurant, user }) => {
        pollInstance = poll;
        restaurantInstance = restaurant;
        userInstance = user;
        return Vote.create(Object.assign({}, sampleVote, {
          choiceId: restaurantInstance.id,
          pollId: pollInstance.id,
          voterId: userInstance.id
        }));
      })

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
      Promise.all([
        pollInstance.destroy(),
        restaurantInstance.destroy(),
        userInstance.destroy(),
        voteInstance.destroy()
      ])
      .then(() => done());
    });

    it('should return a list of votes when this endpoint is used correctly', (done) => {
      return callServer((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal([{
          id: voteInstance.id,
          rank: 1,
          choice: {
            id: restaurantInstance.id,
            name: 'Subway'
          },
          voter: {
            id: userInstance.id,
            name: 'Adam Connover'
          }
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

    let pollInstance;
    let restaurantInstance;
    let userInstance;

    const validPayload = [];

    function callServer(payload, test) {
      return server.inject({
        method: 'POST',
        url: '/votes',
        payload
      }, test);
    }

    before((done) => {
      Promise.props({
        poll: Poll.create(samplePoll),
        restaurant: Restaurant.create(sampleRestaurant),
        user: User.create(sampleUser)
      })

      .then(({ poll, restaurant, user }) => {
        pollInstance = poll;
        restaurantInstance = restaurant;
        userInstance = user;
        validPayload.push(Object.assign({}, sampleVote, {
          choice: {
            id: restaurantInstance.id,
            name: restaurantInstance.name
          },
          voter: {
            id: userInstance.id,
            name: userInstance.name
          }
        }));
        return done();
      });
    });

    afterEach((done) => {
      Vote.createVote.restore && Vote.createVote.restore();
      return done();
    });

    after((done) => {
      Promise.all([
        pollInstance.destroy(),
        restaurantInstance.destroy(),
        userInstance.destroy()
      ])
      .then(() => done());
    });

    it('should return a new vote when this endpoint is used correctly', (done) => {
      return callServer(validPayload, (response) => {
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.equal([{
          id: response.result[0].id,
          rank: 1,
          choice: {
            id: restaurantInstance.id,
            name: 'Subway'
          },
          voter: {
            id: userInstance.id,
            name: 'Adam Connover'
          }
        }]);

        return Promise.map(response.result, (vote) => {
          return Vote.findById(vote.id);
        })
        .then((votes) => Promise.map(votes, (vote) => {
          return vote.destroy();
        }))
        .then(() => done());
      });
    });

    describe('bad request', () => {

      it('should return a 400 if the payload is not an array', (done) => {
        const invalidPayload = {};

        return callServer(invalidPayload, (response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.result).to.equal({
            error: 'Bad Request',
            message: '"Votes" must be an array',
            statusCode: 400,
            validation: {
              keys: ['Votes'],
              source: 'payload'
            }
          });
          return done();
        });
      });
    });

    it('should return a 500 if an unknown/unhandled error happens', (done) => {
      sinon.stub(Vote, 'createVote').returns(Promise.reject('POST /votes stubbed error'));
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
