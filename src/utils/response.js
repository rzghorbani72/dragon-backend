const _ = require('lodash');
exports.response = async (res, {name, statusCode, message, details={}}) => {
    return res.status(statusCode).json({
        name,
        statusCode,
        status:_.startsWith(statusCode,2) ? 'ok' : 'fail',
        message,
        details
    });
}