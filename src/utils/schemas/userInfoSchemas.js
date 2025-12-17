import Joi from "joi";

const userInfoSchema = Joi.object({
  date_of_birth: Joi.date().optional(),

  body_type: Joi.string()
    .valid(
      "slim",
      "athletic",
      "average",
      "curvy",
      "muscular",
      "plus size",
      "other"
    )
    .optional(),

  height: Joi.number()
    .min(50)
    .max(250)
    .optional()
    .messages({
      "number.base": "Height must be a number in centimeters",
    })
    .required(),

  weight: Joi.number()
    .min(30)
    .max(300)
    .optional()
    .messages({
      "number.base": "Weight must be a number in kilograms",
    })
    .required(),

  eye_color: Joi.string()
    .valid(
      "black",
      "brown",
      "blue",
      "green",
      "hazel",
      "grey",
      "amber",
      "other"
    )
    .optional()
    .required(),

  hair_color: Joi.string()
    .valid(
      "black",
      "brown",
      "blonde",
      "red",
      "grey",
      "white",
      "colored",
      "other"
    )
    .required(),

  region: Joi.string().max(50).required(),

  nationality: Joi.string().max(50).required(),

  sexual_orientation: Joi.string().required(),

  city: Joi.string().max(50).required(),

  field_of_work: Joi.string().max(100).required(),

  education: Joi.string()
    .valid(
      "high school",
      "diploma",
      "bachelor",
      "master",
      "phd",
      "other"
    )
    .optional(),

  zodiac_sign: Joi.string()
    .valid(
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces"
    )
    .required(),

  relationship_status: Joi.string()
    .valid(
      "single",
      "in a relationship",
      "married",
      "divorced",
      "widowed",
      "complicated",
      "other"
    )
    .required(),

  drinking: Joi.string()
    .valid("yes", "no", "occasionally")
    .required(),

  smoking: Joi.string()
    .valid("yes", "no", "occasionally")
    .required(),

  piercing: Joi.string()
    .valid("yes", "no")
    .required(),

  tattoos: Joi.string()
    .valid("yes", "no")
    .required(),

  about_your_perfect_match: Joi.string()
    .max(500)
    .optional(),

  about_me: Joi.string()
    .max(500)
    .optional(),
});

export default userInfoSchema;
