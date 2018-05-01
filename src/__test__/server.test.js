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
    color: faker.commerce.color(),
  }).save();
};

describe('/api/motorcycles', () => {
  beforeAll(startServer); 
  afterAll(stopServer);
  afterEach(() => Motorcycle.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const motorcycleToPost = {
      model: faker.lorem.words(10),
      brand: faker.lorem.words(50),
      color: faker.commerce.color(),
      year: 2018,
    };
    return superagent.post(apiURL)
      .send(motorcycleToPost)
      .then((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(200);
        // Vinicio - Testing for specific values
        expect(response.body.model).toEqual(motorcycleToPost.model);
        expect(response.body.brand).toEqual(motorcycleToPost.brand);
        expect(response.body.color).toEqual(motorcycleToPost.color);
        expect(response.body.year).toEqual(motorcycleToPost.year);
        // // Vinicio - Testing that properties are present
        expect(response.body._id).toBeTruthy();
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
      // const motorcycleToTest = null; //  Vinicio - we need to preserve the motorcycle because 
      // of scope rules
      return superagent.get(`${apiURL}`)
        .then((response) => {
          expect(response.status).toEqual(200);
        // expect(response.body); ?? expect array as a response
        });
    });
    test('should respond with 404 if there is no motorcycle to be found', () => {
      return superagent.get(`${apiURL}/InvalidIdSubmitted`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });


  describe('GET /api/motorcycles:id', () => {
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
          expect(response.body.model).toEqual(motorcycleToTest.model);
          expect(response.body.brand).toEqual(motorcycleToTest.brand);
          expect(response.body.year).toEqual(motorcycleToTest.year);
          expect(response.body.color).toEqual(motorcycleToTest.color);
        });
    });
    test('should respond with 404 if there is no motorcycle to be found', () => {
      return superagent.get(`${apiURL}/InvalidIdSubmitted`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/motorcycles:id', () => {
    test('should respond with 416 if there is no ID in query', () => {
      // let motorcycleToTest = null; //  dummy variable to allow for extra scope for motorcycle
      return superagent.delete(apiURL) 
        .then(() => {})
        .catch((error) => {
          expect(error.status).toEqual(416);
        });
    });
    test('should respond with 204 if the item has been deleted successfully', () => {
      // let motorcycleToTest = null; //  dummy variable to allow for extra scope for motorcycle
      return createMotorcycleMock()
        .then((motorcycle) => {
          return superagent.delete(`${apiURL}/${motorcycle._id}`);
        }).then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no motorcycle to be found', () => {
      return superagent.delete(`${apiURL}/InvalidIdSubmitted`)
        .then((Promise.reject)) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
