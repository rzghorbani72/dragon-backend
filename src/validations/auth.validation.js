import { Joi } from "express-validation";

export default {
  // POST /v1/auth/login
  authenticate: {
    body: Joi.object({
      email: Joi.string().email(),
      phone_number: Joi.string()
        .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im)
        .required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{5,30}/),
    }),
  },
  // POST /v1/auth/register
  register: {
    body: Joi.object({
      phone_number: Joi.string()
        .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im)
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{5,30}/)
        .required(),
    }),
  },
  // POST /v1/auth/login
  verification: {
    body: Joi.object({
      token: Joi.string().required(),
      code: Joi.string().required(),
    }),
  },
  retry: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
  logout: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
};
