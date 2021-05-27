'use strict';

process.env.SECRET = 'toes';

const server = require('../servers/server.js').server;
const supergoose = require('@code-fellows/supergoose');


const mockRequest = supergoose(server);

let user = {
  username: 'nour',
  password: 'admin',
  role: 'admin',
};

describe('Authentication Routes', () => {
  it('POST -----> (/signup) it s creates a new user and sends an object with the user and the token to the client', async() => {
    let test = await mockRequest.post('/signup').send(user);

    expect(test.body.user.username).toEqual('nour');
    expect(test.body.token).toBeDefined();
    expect(test.status).toEqual(201);
  });

  it('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async() => {

    let test = await mockRequest.post('/signin').auth(user.username, user.password);


    expect(test.body.user.role).toEqual('admin');
    expect(test.status).toEqual(200);
  });


  it('GET /users with bearer token and permission to delete as an admin', async() => {
    let testS = await mockRequest.post('/signin').auth(user.username, user.password);

    let token = ` Bearer ${testS.body.token}`;

    let test = await mockRequest.get('/users').set(`Authorization`, `${token}`);


    expect(test.body[0]).toEqual('nour');
    expect(test.status).toEqual(200);
  });


  it('GET /secret with bearer token', async() => {
    let testS = await mockRequest.post('/signin').auth(user.username, user.password);

    let token = `Bearer ${testS.body.token}`;

    let test = await mockRequest.get('/secret').set(`Authorization`, `${token}`);


    expect(test.text).toEqual('Welcome to the secret area');
    expect(test.status).toEqual(200);
  });
});


// let users = {
//   admin: { username: 'admin', password: 'password', role: 'admin' },
//   editor: { username: 'editor', password: 'password', role: 'editor' },
//   user: { username: 'user', password: 'password', role: 'user' },
// };
  
// describe('Auth Router', () => {
  
//   Object.keys(users).forEach(userType => {
  
//     describe(`${userType} users`, () => {
  
//       it('can create one', async () => {
  
//         const response = await mockRequest.post('/signup').send(users[userType]);
//         const userObject = response.body;
  
//         expect(response.status).toBe(201);
//         expect(userObject.token).toBeDefined();
//         expect(userObject.user._id).toBeDefined();
//         expect(userObject.user.username).toEqual(users[userType].username);
  
//       });
  
//       it('can signin with basic', async () => {
  
//         const response = await mockRequest.post('/signin')
//           .auth(users[userType].username, users[userType].password);
  
//         const userObject = response.body;
//         expect(response.status).toBe(200);
//         expect(userObject.token).toBeDefined();
//         expect(userObject.user._id).toBeDefined();
//         expect(userObject.user.username).toEqual(users[userType].username);
  
//       });
  
//       it('can signin with bearer', async () => {
//         // First, use basic to login to get a token
//         const response = await mockRequest
//           .post('/signin')
//           .auth(users[userType].username, users[userType].password);
  
//         const token = response.body.token;
  
//         // First, use basic to login to get a token
//         const bearerResponse = await mockRequest
//           .get('/secret')
//           .set('Authorization', `Bearer ${token}`);
  
//         // Not checking the value of the response, only that we "got in"
//         expect(bearerResponse.status).toBe(200);
//       });
  
//     });
  
//     describe('bad logins', () => {
//       it('basic fails with known user and wrong password ', async () => {
  
//         const response = await mockRequest.post('/signin')
//           .auth('admin', 'xyz');
//         const userObject = response.body;
  
//         expect(response.status).toBe(403);
//         expect(userObject.user).not.toBeDefined();
//         expect(userObject.token).not.toBeDefined();
  
//       });
  
//       it('basic fails with unknown user', async () => {
  
//         const response = await mockRequest.post('/signin')
//           .auth('nobody', 'xyz');
//         const userObject = response.body;
  
//         expect(response.status).toBe(403);
//         expect(userObject.user).not.toBeDefined();
//         expect(userObject.token).not.toBeDefined();
  
//       });
  
//       it('bearer fails with an invalid token', async () => {
  
//         // First, use basic to login to get a token
//         const bearerResponse = await mockRequest
//           .get('/users')
//           .set('Authorization', `Bearer foobar`);
  
//         // Not checking the value of the response, only that we "got in"
//         expect(bearerResponse.status).toBe(500);
  
//       });
//     });
  
//   });
  
// });