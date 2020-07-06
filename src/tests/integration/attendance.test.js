// /* eslint-disable arrow-body-style */
// /* eslint-disable no-unused-expressions */
// const request = require('supertest');
// const httpStatus = require('http-status');
// const { expect } = require('chai');
// const bcrypt = require('bcryptjs');
// const src = require('../../../index');
// const User = require('../../models/user.model');
//
// /**
//  * root level hooks
//  */
//
// describe('Attendance API', async () => {
//   const password = '123456';
//   const passwordHashed = await bcrypt.hash(password, 1);
//
//   let userAccessToken;
//   let dbUsers;
//   let user;
//   let attendance;
//
//   beforeEach(async () => {
//     dbUsers = {
//       branStark: {
//         email: 'branstark@gmail.com',
//         username: 'branstark@gmail.com',
//         password: passwordHashed,
//         name: 'Bran Stark',
//         role: 'admin',
//       },
//       jonSnow: {
//         email: 'jonsnow@gmail.com',
//         username: 'jonsnow@gmail.com',
//         password: passwordHashed,
//         name: 'Jon Snow',
//       },
//     };
//     attendance = {
//       eventId: '123',
//       status: 'yes',
//     };
//
//     user = {
//       email: 'sousa.dfs@gmail.com',
//       username: 'sousa.dfs@gmail.com',
//       password,
//       name: 'Daniel Sousa',
//       src: {
//         platform: 'android',
//         version: '1.0.0',
//       },
//     };
//
//     await User.deleteMany({});
//     await User.insertMany([dbUsers.branStark, dbUsers.jonSnow]);
//     dbUsers.branStark.password = password;
//     dbUsers.jonSnow.password = password;
//     userAccessToken = (await User.findAndGenerateToken(dbUsers.jonSnow)).accessToken;
//   });
//
//   describe('POST /v1/attendances', () => {
//     it('should set a new attendance when request is ok', () => {
//       return request(src)
//         .post('/v1/attendances')
//         .set('Authorization', `Bearer ${userAccessToken}`)
//         .send(attendance)
//         .expect(httpStatus.OK)
//         .then((res) => {
//           expect(res.body).to.be.an('object');
//         });
//     });
//     /*
//     it('should report error without stacktrace when accessToken is expired', async () => {
//       // fake time
//       const clock = sinon.useFakeTimers();
//       const expiredAccessToken = (await
//       User.findAndGenerateToken(dbUsers.branStark))
//       .accessToken;
//
//       // move clock forward by minutes set in config + 1 minute
//       clock.tick((JWT_EXPIRATION * 60000) + 60000);
//
//       return request(src)
//         .get('/v1/users/profile')
//         .set('Authorization', `Bearer ${expiredAccessToken}`)
//         .expect(httpStatus.UNAUTHORIZED)
//         .then((res) => {
//           expect(res.body.code).to.be.equal(httpStatus.UNAUTHORIZED);
//           expect(res.body.message).to.be.equal('jwt expired');
//           expect(res.body).to.not.have.a.property('stack');
//         });
//     }); */
//
//     it('should report error when eventId type is wrong', () => {
//       user.email = dbUsers.branStark.email;
//       return request(src)
//         .post('/v1/attendances')
//         .set('Authorization', `Bearer ${userAccessToken}`)
//         .send(attendance)
//         .expect(httpStatus.BAD_REQUEST)
//         .then((res) => {
//           const { field } = res.body.errors[0];
//           const { location } = res.body.errors[0];
//           const { messages } = res.body.errors[0];
//           const { types } = res.body.errors[0];
//           expect(field).to.be.equal('eventId');
//           expect(location).to.be.equal('body');
//           expect(messages).to.include('"eventId" must be a string');
//           expect(types).to.include('string.base');
//         });
//     });
//
//     it('should report error when status type is wrong', () => {
//       user.email = dbUsers.branStark.email;
//       return request(src)
//         .post('/v1/attendances')
//         .set('Authorization', `Bearer ${userAccessToken}`)
//         .send(attendance)
//         .expect(httpStatus.BAD_REQUEST)
//         .then((res) => {
//           const { field } = res.body.errors[0];
//           const { location } = res.body.errors[0];
//           const { messages } = res.body.errors[0];
//           const { types } = res.body.errors[0];
//           expect(field).to.be.equal('status');
//           expect(location).to.be.equal('body');
//           expect(messages).to.include('"status" must be a string');
//           expect(types).to.include('string.base');
//         });
//     });
//   });
// });
