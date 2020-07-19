const {Joi} = require('express-validation')
const schema = Joi.object().keys({
    sale: Joi.string().valid('free', 'forSubscription', 'forSale', 'inherit').optional(),
});
const common_schema = {
    token: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    file_address: Joi.string().optional(),
    file_name: Joi.string().optional(),
    duration: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
    sale: Joi.valid(schema),
    order: Joi.boolean().optional(),
    courseId:Joi.number().required()
}

module.exports = {
    create: {
        body: Joi.object(common_schema),
    },
    update: {
        body: Joi.object(common_schema),
    },
    list: {
        body: Joi.object({
            token: Joi.string().required(),
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            is_active: Joi.boolean().optional(),
            sale: Joi.valid(schema),
            courseId:Joi.number().optional()
        })
    },
    single: {
        body: Joi.object({
            token: Joi.string().required(),
            id: Joi.number().optional(),
        }),
    },
    remove: {
        body: Joi.object({
            token: Joi.string().required(),
            id: Joi.number().optional(),
        }),
    }
};