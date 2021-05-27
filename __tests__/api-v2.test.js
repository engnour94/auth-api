'use strict';

require('dotenv').config();
const server = require('../servers/server.js').server;
require('@code-fellows/supergoose');

const supertest = require('supertest');
const request = supertest(server);


let clothes = {
  name: 'skirt',
  color: 'pink',
  size: 'small',
};
let user = {
  username: 'Nour',
  password: '1234',
  role: 'admin',
};

describe('V2', () => {
  it('testing POST /api/v2/:model with a bearer token that has create permissions to create an item ', async() => {

    let siginUp = await request.post('/signup').send(user);
    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = ` Bearer ${siginIn.body.token}`;
    let test = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
    expect(test.body.color).toEqual('pink');
    expect(test.body.size).toEqual('small');
    expect(test.status).toEqual(201);
  });


  it('testing GET /api/v2/:model with a bearer token that has read permissions', async() => {

    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${siginIn.body.token}`;
    let test = await request.get('/api/v2/clothes').set(`Authorization`, token);


    expect(test.body[0].name).toEqual('skirt');
    expect(test.status).toEqual(200);
  });


  it('testing GET /api/v2/:model/ID with a bearer token that has read permissions ', async() => {

    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${siginIn.body.token}`;

    let postSomething = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);

    let id = postSomething.body._id;

    let testGEtById = await request.get(`/api/v2/clothes/${id}`).set(`Authorization`, token);

    expect(testGEtById.status).toEqual(200);
    expect(testGEtById.text).toBeDefined();
  });


  it(' testing PUT /api/v2/:model/ID with a bearer token that has update permissions by ID', async() => {

    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${siginIn.body.token}`;

    let postSomething = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
    let id = postSomething.body._id;

    let updated = {
      name: 'skirt',
      color: 'green',
      size: 'Small',
    };

    let updateSomething = await request.put(`/api/v2/clothes/${id}`).set(`Authorization`, token).send(updated);

    expect(updateSomething.status).toEqual(200);
    expect(updateSomething.body.size).toEqual('Small');
  });
  it('Testing PATCH /api/v2/:model/ID with a bearer token that has update permissions by ID', async() => {

    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${siginIn.body.token}`;

    let postSomething = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
    let id = postSomething.body._id;

    let updated = {
      name: 'skirt',
      color: 'green',
      size: 'Small',
    };

    let updateSomething = await request.patch(`/api/v2/clothes/${id}`).set(`Authorization`, token).send(updated);

    expect(updateSomething.status).toEqual(200);
    expect(updateSomething.body.size).toEqual('Small');
  });



  it('Testing DELETE /api/v2/:model/ID with a bearer token that has delete permissions', async() => {

    let siginIn = await request.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${siginIn.body.token}`;

    let postSomething = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
    let id = postSomething.body._id;



    let deleteItem = await request.delete(`/api/v2/clothes/${id}`).set(`Authorization`, token);
    let testGEtById = await request.get(`/api/v2/clothes/${id}`).set(`Authorization`, token);


    expect(deleteItem.status).toEqual(200);
    expect(deleteItem.data).not.toBeDefined();
    expect(testGEtById.body).toBeNull();

  });
});