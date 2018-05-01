'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Motorcycle from '../model/motorcycle';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/motorcycles`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const createMotorcycleMock = () => {
  return new Motorcycle({
    model: faker.lorem.words(10), // need to change and add new things to schema
    brand: faker.lorem.words(25),
    year: 2016,
  }).save();
};

describe('/api/motorcycles', () => {
  // I know that I'll gave a POST ROUTE
  // The post route will be able to insert a new motorcycle to my application
  beforeAll(startServer); // Vinicio - we don't use startServer() because we need a function
  afterAll(stopServer);
  afterEach(() => Motorcycle.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const motorcycleToPost = {
      model: faker.lorem.words(10),
      brand: faker.lorem.words(50),
      year: 2018,
    };
    return superagent.post(apiURL)
      .send(motorcycleToPost)
      .then((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(200);
        // Vinicio - Testing for specific values
        expect(response.body.title).toEqual(motorcycleToPost.title);
        expect(response.body.content).toEqual(motorcycleToPost.content);
        // Vinicio - Testing that properties are present
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const motorcycleToPost = {
      brand: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(motorcycleToPost)
      .then(Promise.reject) // Vinicio - this is needed because we are testing for failures
      .catch((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/motorcycles', () => {
    test('should respond with 200 if there are no errors', () => {
      let motorcycleToTest = null; //  Vinicio - we need to preserve the motorcycle because 
      // of scope rules
      return createMotorcycleMock() // Vinicio - test only a GET request
        .then((motorcycle) => {
          motorcycleToTest = motorcycle;
          return superagent.get(`${apiURL}/${motorcycle._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(motorcycleToTest.title);
          expect(response.body.content).toEqual(motorcycleToTest.content);
        });
    });
    test('should respond with 404 if there is no motorcycle to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
