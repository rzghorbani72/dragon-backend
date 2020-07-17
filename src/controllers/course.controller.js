const httpStatus = require('http-status');
const db = require("../models");
const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;
const _ = require('lodash');
const Op = db.Sequelize.Op;
const moment = require('moment-timezone');
const crypto = require('crypto');
const {response} = require('../utils/response')
const randomNumber = require("random-number-csprng");
_.isFalse = (x) => _.includes(["false", false], x);
_.isTrue = (x) => _.includes(["true", true], x);


exports.create = async (req, res) => {

}
exports.update = async (req, res) => {

}
exports.delete = async (req, res) => {//deactivate

}