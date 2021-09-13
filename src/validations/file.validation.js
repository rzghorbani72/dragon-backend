import { Joi } from "express-validation";

export default {
  uploadVideo: {
    body: Joi.object({
      isPrivate: Joi.boolean().required(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      courseId: Joi.number().optional(),
    }),
  },
  uploadImage: {
    body: Joi.object({
      isPrivate: Joi.boolean().optional(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
      courseId: Joi.number().optional(),
    }),
  },
  updateFile: {
    body: Joi.object({
      isPrivate: Joi.boolean().optional(),
      order: Joi.number().optional(),
      title: Joi.string().required(),
      courseId: Joi.number().optional(),
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
