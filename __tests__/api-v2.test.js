
'use strict';
process.env.SECRET='mysecret';
const supergoose = require('@code-fellows/supergoose');
require('dotenv').config();
const server = require('../servers/server.js').server;
const Users = require('../servers/auth-server/src/auth/models/users');
const jwt = require('jsonwebtoken');
const request = supergoose(server);
let users =
 { admin: 
    { username: 'NOUR',
      password: '1234',
      role: 'admin' } };

beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});

const user = { username: 'NOUR' };
const token = jwt.sign(user, process.env.SECRET);
let id;
console.log(token);

describe('test api/v2/food', () => {
  it(' POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async () => {
    const response = await request.post('/api/v2/food').send(
      { name: 'Tomato',
        calories: 25,
        type: 'VEGETABLE' }).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('Tomato');
    id = response.body._id;
  });
  it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
    const res = await request.get('/api/v2/food').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
  });
  it('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async () => {
    const res = await request.get(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual('Tomato');
  });
  it('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
    const res = await request.put(`/api/v2/food/${id}`).send({ name: 'Potato', calories: 25, type: 'VEGETABLE' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual('Potato');
  });
  it('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const res = await request.put(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual('Potato');
  });
});



