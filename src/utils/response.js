exports.response = async (res, {name, statusCode, message, details={}}) => {
    return res.status(statusCode).json({
        name,
        statusCode,
        message,
        details
    });
}