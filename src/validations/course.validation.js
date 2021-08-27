import { Joi } from "express-validation";
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });
const common_schema = {};
const search_schema = {
  offset: Joi.number().optional(),
  limit: Joi.number().optional(),
  title: Joi.string().required(),
  description: Joi.string().optional(),
  language: Joi.string().optional(),
  order: Joi.number().optional(),
  featured_order: Joi.number().optional(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  price: Joi.number().required(),
  primary_price: Joi.number().required(),
  category_ids: Joi.string().required(),
};

export default {
  create: {
    body: Joi.object({
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      language: Joi.string().optional(),
      order: Joi.number().optional(),
      featured_order: Joi.number().optional(),
      featured: Joi.boolean().optional(),
      is_active: Joi.boolean().optional(),
      price: Joi.number().required(),
      primary_price: Joi.number().required(),
      category_ids: Joi.string().required(),
      userId: Joi.number().optional(),
    }),
  },
  update: {
    body: Joi.object(common_schema),
  },
  list: {
    body: Joi.object(search_schema),
  },
  search: {
    body: Joi.object(search_schema),
  },
  single: {
    body: Joi.object({
      id: Joi.number().optional(),
    }),
  },
  remove: {
    body: Joi.object({
      id: Joi.number().optional(),
    }),
  },
};
