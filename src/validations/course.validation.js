import { Joi } from "express-validation";
// const schema = Joi.object().keys({
//     sale: Joi.string().validate('free', 'forSubscription', 'forSale', 'inherit'),
// });
const common_schema = {
  offset: Joi.number().optional(),
  limit: Joi.number().optional(),
  title: Joi.string().required(),
  description: Joi.string().optional(),
  language: Joi.string().valid("fa", "en", "dubbed").required(),
  order: Joi.number().optional(),
  featured_order: Joi.number().optional(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  price: Joi.number().required(),
  primary_price: Joi.number().required(),
  category_ids: Joi.string().required(),
  userId: Joi.number().optional(),
  imageId: Joi.number().optional(),
};
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
      language: Joi.string().valid("fa", "en", "dubbed").required(),
      order: Joi.number().optional(),
      featured_order: Joi.number().optional(),
      featured: Joi.boolean().optional(),
      is_active: Joi.boolean().optional(),
      price: Joi.number().required(),
      primary_price: Joi.number().required(),
      category_ids: Joi.string().required(),
      level: Joi.string().optional(),
      userId: Joi.number().optional(),
      imageId: Joi.number().optional(),
    }),
  },
  update: {
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      language: Joi.string().valid("fa", "en", "dubbed").required(),
      price: Joi.number().required(),
      primary_price: Joi.number().required(),
      order: Joi.number().required(),
      featured_order: Joi.number().required(),
      featured: Joi.boolean().required(),
      is_active: Joi.boolean().required(),
      category_ids: Joi.string().required(),
      level: Joi.string().optional(),
      userId: Joi.number().optional(),
      imageId: Joi.number().optional(),
    }),
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  list: {
    body: Joi.object({
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.string().valid(
        "updatedAt",
        "createdAt",
        "price",
        "visit_count",
        "featured_order"
      ),
      is_active: Joi.boolean().optional(),
      orderBy: Joi.string().valid("DESC", "ASC"),
      categoryId: Joi.number().optional(),
    }),
  },
  search: {
    body: Joi.object(search_schema),
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
