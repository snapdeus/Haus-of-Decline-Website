const Joi = require('joi');


module.exports.comicSchema = Joi.object({
    comic: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        // path: Joi.string().required(),
        filename: Joi.string(),
    }).required(),

})



