const express = require('express');
const {validate, ValidationError} = require('express-validation');
const controller = require('../../controllers/category.controller');
const {
    create, update, list, single, remove
} = require('../../validations/category.validation');

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
module.exports = router;
