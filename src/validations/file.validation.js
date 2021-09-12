import { Joi } from "express-validation";

export default {
  uploadVideo: {
    body: Joi.object({
      video: Joi.any().required(),
      isPrivate: Joi.boolean().required(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
    }),
  },
  uploadImage: {
    body: Joi.object({
      image: Joi.any().required(),
      isPrivate: Joi.boolean().optional(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
    }),
  },
  updateFile: {
    body: Joi.object({
      isPrivate: Joi.boolean().optional(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
    }),
  },
  list: {
    query: Joi.object({
      type: Joi.string().valid("image", "video").optional(),
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
