/* eslint-disable arrow-body-style */
/* eslint-disable  no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const User = require('../../models/user.model');
const RefreshToken = require('../../models/refreshToken.model');

const sandbox = sinon.createSandbox();


describe('Event API', () => {
  let dbAdmin;
  // let admin;
  // let refreshToken;
  // let expiredRefreshToken;
  let adminAccessToken;

  beforeEach(async () => {
    dbAdmin = {
      email: 'miladr0r@gmail.com',
      username: 'miladr0r@gmail.com',
      password: '123456',
      name: 'milad ranjbar',
      role: 'admin',
      app: {
        platform: 'android',
        version: '1.0.0',
      },
    };

    // admin = {
    //   email: 'miladr0r@gmail.com',
    //   username: 'miladr0r@gmail.com',
    //   password: '123456',
    //   name: 'milad ranjbar',
    //   src: {
    //     platform: 'android',
    //     version: '1.0.0',
    //   },
    // };


    await User.deleteMany({});
    await User.create(dbAdmin);
    await RefreshToken.deleteMany({});
    adminAccessToken = (await User.findAndGenerateToken(dbAdmin)).accessToken;
  });

  afterEach(() => sandbox.restore());

  describe('GET /v1/events', () => {
    describe('without using token in header', () => {
      it('should return array of events ', () => {
        return request(app)
          .get('/v1/events')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('events');
            expect(res.body.events).to.be.an('array').that.is.not.empty;
            expect(res.body).to.have.a.property('total_count');
            expect(res.body).to.have.a.property('limit');
          });
      });
    });

    describe('using token in header', () => {
      it('should return array of events ', () => {
        return request(app)
          .get('/v1/events')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('events');
            expect(res.body.events).to.be.an('array').that.is.not.empty;
            expect(res.body).to.have.a.property('total_count');
            expect(res.body).to.have.a.property('limit');
          });
      });

      it('should return array of events limit to one event using pagination', () => {
        return request(app)
          .get('/v1/events?limit=1')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('events');
            expect(res.body.events).to.be.an('array').that.is.not.empty;
            expect(res.body.events).to.have.lengthOf(1);
            expect(res.body.limit).to.equal(1);
          });
      });

      it('get featured events', () => {
        return request(app)
          .get('/v1/events?featured=true')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('events');
            expect(res.body.events).to.be.an('array').that.is.not.empty;
            // expect(res.body.events).should.all.have.property("featured");
            res.body.events.every(event => expect(event).to.have.a.property('featured', true));
          });
      });

      it('events has to have ticket inside them by default', () => {
        return request(app)
          .get('/v1/events')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('events');
            expect(res.body.events).to.be.an('array').that.is.not.empty;
            // expect(res.body.events).should.all.have.property("featured");
            res.body.events.every(event => expect(event).to.have.a.property('ticket'));
          });
      });
    });


  //   it('should report error when email already exists', () => {
  //     return request(src)
  //       .post('/v1/auth/register')
  //       .send(dbUser)
  //       .expect(httpStatus.CONFLICT)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('email');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('user with this "email" already exists');
  //       });
  //   });
  //
  //   it('should report error when the email provided is not valid', () => {
  //     user.username = 'this_is_not_an_email';
  //     return request(src)
  //       .post('/v1/auth/register')
  //       .send(user)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         // console.log(res.body);
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('username');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"username" must be a valid email');
  //       });
  //   });
  //
  //   it('should report error when email and username and password are not provided', () => {
  //     return request(src)
  //       .post('/v1/auth/register')
  //       .send({})
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         // console.log(res.body);
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('email');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"email" is required');
  //       });
  //   });
  //
  //   it('should report error when src filed is not not provided', () => {
  //     delete user.src;
  //     return request(src)
  //       .post('/v1/auth/register')
  //       .send(user)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         // console.log(res.body);
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('src');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"src" is required');
  //       });
  //   });
  //
  //   it('should report error when version and platform are not provided', () => {
  //     delete user.src.platform;
  //     delete user.src.version;
  //     return request(src)
  //       .post('/v1/auth/register')
  //       .send(user)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         // console.log(res.body);
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('src.platform');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"platform" is required');
  //       });
  //   });
  // });
  //
  // describe('POST /v1/auth/login', () => {
  //   it('should return an access_token and a refresh_token
    //   when email and password matches', () => {
  //     return request(src)
  //       .post('/v1/auth/login')
  //       .send(dbUser)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         delete dbUser.password;
  //         expect(res.body.token).to.have.a.property('access_token');
  //         expect(res.body.token).to.have.a.property('refresh_token');
  //         expect(res.body.token).to.have.a.property('expiresIn');
  //         // expect(res.body.user).to.be.an('object');
  //       });
  //   });
  //
  //   it('should report error when username and password are not provided', () => {
  //     return request(src)
  //       .post('/v1/auth/login')
  //       .send({})
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('username');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"username" is required');
  //       });
  //   });
  //
  //   it('should report error when the username provided is not valid', () => {
  //     user.username = 'this_is_not_an_email';
  //     return request(src)
  //       .post('/v1/auth/login')
  //       .send(user)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('username');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"username" must be a valid email');
  //       });
  //   });
  //
  //   it('should report error when username and password don\'t match', () => {
  //     dbUser.password = 'xxx';
  //     return request(src)
  //       .post('/v1/auth/login')
  //       .send(dbUser)
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         const { code } = res.body;
  //         const { message } = res.body;
  //         expect(code).to.be.equal(401);
  //         expect(message).to.be.equal('Incorrect email or password');
  //       });
  //   });
  // });
  //
  // describe('POST /v1/auth/facebook', () => {
  //   it('should create a new user and return an accessToken when user does not exist', () => {
  //     sandbox.stub(authProviders, 'facebook').callsFake(fakeOAuthRequest);
  //     return request(src)
  //       .post('/v1/auth/facebook')
  //       .send({
  //         access_token: '123',
  //         src: {
  //           platform: 'android',
  //           version: '1.0.0',
  //         },
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.token).to.have.a.property('access_token');
  //         expect(res.body.token).to.have.a.property('refresh_token');
  //         expect(res.body.token).to.have.a.property('expiresIn');
  //         expect(res.body.user).to.be.an('object');
  //       });
  //   });
  //
  //   it('should return an accessToken when user already exists', async () => {
  //     dbUser.email = 'test@test.com';
  //     await User.create(dbUser);
  //     sandbox.stub(authProviders, 'facebook').callsFake(fakeOAuthRequest);
  //     return request(src)
  //       .post('/v1/auth/facebook')
  //       .send({
  //         access_token: '123',
  //         src: {
  //           platform: 'android',
  //           version: '1.0.0',
  //         },
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.token).to.have.a.property('access_token');
  //         expect(res.body.token).to.have.a.property('refresh_token');
  //         expect(res.body.token).to.have.a.property('expiresIn');
  //         expect(res.body.user).to.be.an('object');
  //       });
  //   });
  //
  //   it('should return error when access_token is not provided', async () => {
  //     return request(src)
  //       .post('/v1/auth/facebook')
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('access_token');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"access_token" is required');
  //       });
  //   });
  // });
  //
  // describe('POST /v1/auth/google', () => {
  //   it('should create a new user and return an accessToken when user does not exist', () => {
  //     sandbox.stub(authProviders, 'google').callsFake(fakeOAuthRequest);
  //     return request(src)
  //       .post('/v1/auth/google')
  //       .send({
  //         access_token: '123',
  //         src: {
  //           platform: 'android',
  //           version: '1.0.0',
  //         },
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.token).to.have.a.property('access_token');
  //         expect(res.body.token).to.have.a.property('refresh_token');
  //         expect(res.body.token).to.have.a.property('expiresIn');
  //         expect(res.body.user).to.be.an('object');
  //       });
  //   });
  //
  //   it('should return an accessToken when user already exists', async () => {
  //     dbUser.email = 'test@test.com';
  //     await User.create(dbUser);
  //     sandbox.stub(authProviders, 'google').callsFake(fakeOAuthRequest);
  //     return request(src)
  //       .post('/v1/auth/google')
  //       .send({
  //         access_token: '123',
  //         src: {
  //           platform: 'android',
  //           version: '1.0.0',
  //         },
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.token).to.have.a.property('access_token');
  //         expect(res.body.token).to.have.a.property('refresh_token');
  //         expect(res.body.token).to.have.a.property('expiresIn');
  //         expect(res.body.user).to.be.an('object');
  //       });
  //   });
  //
  //   it('should return error when access_token is not provided', async () => {
  //     return request(src)
  //       .post('/v1/auth/google')
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('access_token');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"access_token" is required');
  //       });
  //   });
  // });
  //
  // describe('POST /v1/auth/token', () => {
  //   it('should return a new access_token when refresh_token and email match', async () => {
  //     await RefreshToken.create(refreshToken);
  //     return request(src)
  //       .post('/v1/auth/token')
  //       .send({
  //         email: dbUser.email,
  //         refreshToken: refreshToken.token,
  //         src: {
  //           platform: 'android',
  //           version: '1.0.0',
  //         },
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.have.a.property('access_token');
  //         expect(res.body).to.have.a.property('refresh_token');
  //         expect(res.body).to.have.a.property('expiresIn');
  //       });
  //   });
  //
  //   it('should report error when email and refreshToken don\'t match', async () => {
  //     await RefreshToken.create(refreshToken);
  //     return request(src)
  //       .post('/v1/auth/token')
  //       .send({ email: user.email, refreshToken: refreshToken.token })
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         const { code } = res.body;
  //         const { message } = res.body;
  //         expect(code).to.be.equal(401);
  //         expect(message).to.be.equal('Incorrect email or refreshToken');
  //       });
  //   });
  //
  //   it('should report error when email and refreshToken are not provided', () => {
  //     return request(src)
  //       .post('/v1/auth/token')
  //       .send({})
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const field1 = res.body.errors[0].field;
  //         const location1 = res.body.errors[0].location;
  //         const messages1 = res.body.errors[0].messages;
  //         const field2 = res.body.errors[1].field;
  //         const location2 = res.body.errors[1].location;
  //         const messages2 = res.body.errors[1].messages;
  //         expect(field1).to.be.equal('email');
  //         expect(location1).to.be.equal('body');
  //         expect(messages1).to.include('"email" is required');
  //         expect(field2).to.be.equal('refreshToken');
  //         expect(location2).to.be.equal('body');
  //         expect(messages2).to.include('"refreshToken" is required');
  //       });
  //   });
  //
  //   it('should report error when the refreshToken is expired', async () => {
  //     await RefreshToken.create(expiredRefreshToken);
  //
  //     return request(src)
  //       .post('/v1/auth/token')
  //       .send({ email: dbUser.email, refreshToken: expiredRefreshToken.token })
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(401);
  //         expect(res.body.message).to.be.equal('Invalid refresh token.');
  //       });
  //   });
  });

  // describe('POST /v1/auth/firebase', () => {
  //   it('should save user firebase token', async () => {
  //     const fireBaseToken = 'fake_token_5c3c724ab06b9b0f29ef52bd.d67c11c
  //     2e010050c45b650b868e2bcc7f4a99f5bf4d2ee216c001168a602ee4bcd39e8141424eea8';
  //     return request(src)
  //       .post('/v1/auth/firebase')
  //       .send({ firebase_token: fireBaseToken })
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.OK);
  //   });
  //
  //   it('should report error when firebase_token not provided', async () => {
  //     return request(src)
  //       .post('/v1/auth/firebase')
  //       .send({})
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('firebase_token');
  //         expect(location).to.be.equal('body');
  //         expect(messages).to.include('"firebase_token" is required');
  //       });
  //   });
  //
  //   it('should report error when Auth Token not provided', async () => {
  //     return request(src)
  //       .post('/v1/auth/firebase')
  //       .send({ firebase_token: 'fake_firebase_token' })
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         const { message } = res.body;
  //         expect(message).to.include('No auth token');
  //       });
  //   });
  // });
});
