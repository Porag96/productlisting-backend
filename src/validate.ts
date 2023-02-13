const joi = require("joi");

export const Validate = (data: object) => {
  const schema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    sku: joi.string().required(),
    desc: joi.string().required(),
  });

  return schema.validate(data);
};
