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
    try {

    }catch (e) {

    }
}
exports.list = async (req, res) => {
    try {

    }catch (e) {

    }
}
exports.single = async (req, res) => {
    try {

    }catch (e) {

    }
}
exports.update = async (req, res) => {
    try {

    }catch (e) {

    }
}
exports.remove = async (req, res) => {//deactivate
    try {

    }catch (e) {

    }
}
