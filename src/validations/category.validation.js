import { Joi } from "express-validation";
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });
const common_schema = {
  token: Joi.string().required(),
  name: Joi.string().required(),
  parent_id: Joi.number().optional(),
};

export default {
  create: {
    body: Joi.object(common_schema),
  },
  update: {
    body: Joi.object({
      token: Joi.string().required(),
      name: Joi.string().optional(),
      id: Joi.number().optional(),
      parent_id: Joi.number().optional(),
    }),
  },
  list: {
    headers: Joi.any,
  },
  single: {
    body: Joi.object({
      token: Joi.string().required(),
      id: Joi.number().optional(),
      name: Joi.string().optional(),
    }),
  },
  remove: {
    body: Joi.object({
      token: Joi.string().required(),
      id: Joi.number().required(),
    }),
  },
};
