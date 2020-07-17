const express = require('express');
const {validate, ValidationError} = require('express-validation');
const controller = require('../../controllers/auth.controller');
const {
    authenticate, verification, retry, logout
} = require('../../validations/auth.validation');


const router = express.Router();
router.route('/login')
    .post(validate(authenticate), controller.authenticate);

router.route('/verify')
    .post(validate(verification), controller.verification);

router.route('/retry')
    .post(validate(retry), controller.retry);
router.route('/logout')
    .post(validate(logout), controller.logout);

router.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
})
// router.route('/login')
//   .post(validate(login), controller.login);
//
// router.route('/logout')
//   .post(validate(logout), controller.logout);
//
// router.route('/token')
//   .post(validate(refresh), controller.refresh);
//
// router.route('/facebook')
//   .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);
//
// router.route('/google')
//   .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

module.exports = router;
