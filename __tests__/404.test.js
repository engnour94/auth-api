
'use strict';

require('dotenv').config();
const server = require('../servers/server.js').server;
require('@code-fellows/supergoose');
const supertest = require('supertest');
const request = supertest(server);


describe('testing 404 errors',()=>{
  it('wrong method', async () => {
    const response = await request.delete('/api/v1/food');
    expect(response.status).toEqual(404);
  });
     
      
  it('should get 404 status', async () => {
    const response = await request.get('/jhu');
    expect(response.status).toBe(404);
  });
});