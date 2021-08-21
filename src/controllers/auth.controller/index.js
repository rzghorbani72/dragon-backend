import db from "../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import crypto from "crypto";
//const EmailService = require('../services/email.service');
import randomNumber from "random-number-csprng";
import logOut from "./logout.js";
import retry from "./retry.js";
import verification from "./verification.js";
import authentication from "./authentication.js";
import register from "./register.js";

const models = db.models;
const User = models.user;
const PhoneNumberVerification = models.phoneNumberVerification;
const EmailProviderVerification = models.emailProviderVerification;
const isTrue = (x) => _.includes(["true", true], x);

export const authenticateController = async (req, res) =>
  await authentication(req, res);

export const verificationController = async (req, res) =>
  await verification(req, res);

export const retryController = async (req, res) => await retry(req, res);

export const registerController = async (req, res) => await register(req, res);

export const logoutController = async (req, res) => await logOut(req, res);
