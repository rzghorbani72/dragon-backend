import { Joi } from "express-validation";
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });

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
      courseId: Joi.string().required(),
      voucherCode: Joi.string().required(),
    }),
  },
  update: {
    body: Joi.object({
      name: Joi.string().optional(),
      type: Joi.string().valid("percent", "amount").optional(),
      apply_to: Joi.string().valid("one", "many").optional(),
      userId: Joi.number().optional(),
      value: Joi.number().optional(),
      expiredAt: Joi.date().raw().optional(),
    }),
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  list: {
    query: Joi.object({
      isExpired: Joi.string().valid("true", "false", "both").required(),
    }),
  },
  single: {
    params: Joi.object({
      name: Joi.string().required(),
    }),
  },
  remove: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  check: {
    params: Joi.object({
      name: Joi.string().required(),
    }),
  },
  generator: {
    body: Joi.object({
      prefix: Joi.string().optional(),
      postfix: Joi.string().optional(),
      count: Joi.number().optional(),
      length: Joi.number().optional(),
    }),
  },
};
