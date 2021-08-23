import { Joi } from "express-validation";
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });
const common_schema = {
  name: Joi.string().required(),
  parent_id: Joi.number().optional(),
  type: Joi.string().valid("category", "folder"),
};

export default {
  create: {
    body: Joi.object(common_schema),
  },
  update: {
    body: Joi.object({
      name: Joi.string().optional(),
      id: Joi.number().required(),
      parent_id: Joi.number().optional(),
    }),
  },
  single: {
    body: Joi.object({
      id: Joi.number().optional(),
    }),
  },
  remove: {
    body: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
