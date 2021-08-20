// import BearerStrategy from "passport-http-bearer";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import variables from "./vars";
// //import authProviders from "../api/services/authProviders";
// import User from "../models/user.model";
// const jwtOptions = {
//   secretOrKey: variables.jwtSecret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
// };
// const jwtFn = async (payload, done) => {
//   try {
//     let user;
//     user = await UserCacheService.getUser(payload.sub);
//     if (!user) {
//       user = await User.findById(payload.sub);
//       // saving in cache
//       UserCacheService.setUser(user._id, user);
//     }
//     // console.log(user);
//     if (user.activation !== true)
//       return done("This account is suspended!", false);
//     if (user) return done(null, user);
//     return done(null, false);
//   } catch (error) {
//     return done(error, false);
//   }
// };
// const oAuth = (service) => async (token, done) => {
//   try {
//     const userData = await authProviders[service](token);
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };
// export const jwt = new Strategy(jwtOptions, jwtFn);
// export const facebook = new BearerStrategy(oAuth("facebook"));
// export const google = new BearerStrategy(oAuth("google"));
"use strict";