const {Joi} = require('express-validation');
const schema = Joi.object().keys({
    sale: Joi.string().valid('free', 'forSubscription', 'forSale', 'inherit'),
});
const common_schema = {
    token: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    language: Joi.string().required(),
    sale: Joi.valid(schema),
    order: Joi.number().optional(),
    featured_order: Joi.number().optional(),
    featured: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
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
            language: Joi.string().optional(),
            sale: Joi.valid(schema),
            featured: Joi.boolean().optional(),
            is_active: Joi.boolean().optional()
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