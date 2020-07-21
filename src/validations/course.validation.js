const {Joi} = require('express-validation');
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });
const common_schema = {
    token: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    language: Joi.string().required(),
    sale: Joi.string().required(),
    order: Joi.number().optional(),
    featured_order: Joi.number().optional(),
    featured: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    category_id: Joi.number().required()
}
const search_schema = {
    token: Joi.string().required(),
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    language: Joi.string().optional(),
    sale: Joi.string().optional(),
    order: Joi.number().optional(),
    featured_order: Joi.number().optional(),
    featured: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    category_id: Joi.string().optional()
}

module.exports = {
    create: {
        body: Joi.object(common_schema)
    },
    update: {
        body: Joi.object(common_schema)
    },
    list: {
        body: Joi.object(search_schema)
    },
    search: {
        body: Joi.object(search_schema)
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