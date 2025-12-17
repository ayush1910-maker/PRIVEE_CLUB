import Joi from "joi";

const edituserInfoSchema = Joi.object({
  
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
    .optional(),

  weight: Joi.number()
    .min(30)
    .max(300)
    .optional()
    .messages({
      "number.base": "Weight must be a number in kilograms",
    })
    .optional(),

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
    .optional(),

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
    .optional(),

  region: Joi.string().max(50).optional(),

  nationality: Joi.string().max(50).optional(),

  sexual_orientation: Joi.string().optional(),

  city: Joi.string().max(50).optional(),

  field_of_work: Joi.string().max(100).optional(),

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
    .optional(),

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
    .optional(),

  drinking: Joi.string()
    .valid("yes", "no", "occasionally")
    .optional(),

  smoking: Joi.string()
    .valid("yes", "no", "occasionally")
    .optional(),

  piercing: Joi.string()
    .valid("yes", "no")
    .optional(),

  tattoos: Joi.string()
    .valid("yes", "no")
    .optional(),

  favourite_music: Joi.string().max(50).optional(),

  favourite_tv_show: Joi.string().max(50).optional(),
  
  favourite_movie: Joi.string().max(50).optional(),
  
  favourite_book: Joi.string().max(50).optional(),
  
  favourite_sport: Joi.string().max(50).optional(),
});

export default edituserInfoSchema;
