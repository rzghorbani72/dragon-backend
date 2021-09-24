import { Joi } from "express-validation";

export default {
  create: {
    body: Joi.object({
      name: Joi.string().required(),
      parent_id: Joi.number().optional(),
      type: Joi.string().valid("category", "episode"),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
    body: Joi.object({
      name: Joi.string().optional(),
      parent_id: Joi.number().optional(),
      type: Joi.string().valid("category", "episode"),
    }),
  },
  single: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  remove: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
