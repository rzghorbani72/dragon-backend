const express = require('express');
const {validate, ValidationError} = require('express-validation');
const controller = require('../../controllers/course.controller');
const {
    create, update, list, single, remove
} = require('../../validations/course.validation');


const router = express.Router();
router.route('/create')
    .post(validate(create), controller.create);
router.route('/update')
    .post(validate(update), controller.update);
router.route('/list')
    .post(validate(list), controller.list);
router.route('/single')
    .post(validate(single), controller.single);
router.route('/delete')
    .post(validate(remove), controller.remove);

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
