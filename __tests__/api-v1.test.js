'use strict';

require('dotenv').config();
const server = require('../servers/server.js').server;
require('@code-fellows/supergoose');
const supertest = require('supertest');
const request = supertest(server);


let foodObj = {
  name: 'Fish',
  calories: 100,
  type: 'PROTIEN',
};

describe('Testing api/v1 Routes', () => {

  it('POST /api/v1/:model should create a new Food using post request and  adding an item to the DB and returns an object with the added item', async() => {
    let test = await request.post('/api/v1/food').send(foodObj);

    expect(test.body.name).toEqual('Fish');
    expect(test.status).toEqual(201);
  });


  it('get all items of :model items GET /api/v1/:model  ', async() => {
    let test = await request.get('/api/v1/food');

    expect(test.body[0].calories).toEqual(100);
    expect(test.status).toEqual(200);
  });



  it('GET /api/v1/:model/ID returns a single item by ID', async() => {
    let test = await request.get('/api/v1/food');
    let id = test.body[0]._id;

    let test2 = await request.get(`/api/v1/food/${id}`);

    expect(test2.body.type).toEqual('PROTIEN');
    expect(test2.status).toEqual(200);
  });
   
 

  it('should update item by ID using put request PUT /api/v1/:model/ID returns a single updated item ' , async() => {
    let test = await request.get('/api/v1/food');
    let id = test.body[0]._id;

    let updatedItem = {
      name: 'Fish',
      calories: 250,
      type: 'PROTIEN',
    };

    let test2 = await request.put(`/api/v1/food/${id}`).send(updatedItem);

    expect(test2.body.calories).toEqual(250);
    expect(test2.status).toEqual(200);
  });

  it('should be able to delete data on DELETE /api/v1/:model/ID returns an empty object.', async() => {
    let test = await request.get('/api/v1/food');
    let id = test.body[0]._id;

    let toDelete = await request.delete(`/api/v1/food/${id}`);
    let toGetDeleted = await request.get(`/api/v1/food/${id}`);

    expect(toDelete.body.name).toEqual('Fish');
    expect(toDelete.status).toEqual(200);

    expect(toGetDeleted.body).toEqual(null);
  });

});