const Joi = require('joi');

module.exports = {
    // POST /v1/auth/register
    register: {
        body: {
            user: Joi.object().keys({
                email: Joi.string().email().required(),
                username: Joi.string().email().required(),
                password: Joi.string().required().min(6).max(128),
                app: Joi.object().keys({
                    platform: Joi.string().valid(['android', 'web', 'ios']).required(),
                    version: Joi.string().required(),
                }).required(),
            }).required(),
        },
    },

    // POST /v1/auth/login
    login: {
        body: {
            user: Joi.object().keys({
                username: Joi.string().email().required(),
                password: Joi.string().required().max(128),
                app: Joi.object().keys({
                    platform: Joi.string().valid(['android', 'web', 'ios']).required(),
                    version: Joi.string().required(),
                }).required(),
            }).required(),
        },
    },

    // POST /v1/auth/facebook
    // POST /v1/auth/google
    oAuth: {
        body: {
            access_token: Joi.string().required(),
            app: Joi.object().keys({
                platform: Joi.string().valid(['android', 'web', 'ios']).required(),
                version: Joi.string().required(),
            }).required(),
        },
    },

    // POST /v1/auth/refresh
    refresh: {
        body: {
            refreshToken: Joi.string().required(),
        },
    },

    // POST /v1/auth/firebase
    fireBaseToken: {
        body: {
            refreshToken: Joi.string().required(),
            firebase_token: Joi.string().required(),
        },
    },

    // POST /v1/auth/logout
    logout: {
        body: {
            refreshToken: Joi.string().required(),
        },
    },

    // PATCH /v1/auth/password/change
    updatePassword: {
        body: {
            old: Joi.string().allow('').min(6).max(128),
            new: Joi.string().min(6).max(128).required(),
            app: Joi.object().keys({
                platform: Joi.string().valid(['android', 'web', 'ios']).required(),
                version: Joi.string().required(),
            }).required(),
        },
    },

    // PATCH /v1/auth/password/reset-password
    resetPassword: {
        body: {
            email: Joi.string().trim().email().required(),
        },
    },

    // POST /v1/auth/password/reset-by-email
    resetByEmail: {
        body: {
            password: Joi.string().min(6).max(128).required(),
            confirmPassword: Joi.string().min(6).max(128).required()
                .valid(Joi.ref('password')),
            resetToken: Joi.string().required(),
        },
    },

    // POST /v1/auth/password/reset-by-email
    confirmByEmail: {
        body: {
            token: Joi.string().required(),
        },
    },
};