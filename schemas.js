const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.togetherComicSchema = Joi.object({
    togetherComic: Joi.object({
        title: Joi.string().required(),

        // path: Joi.string().required(),
        filename: Joi.string(),
        series: Joi.number().required(),
        ordinality: Joi.number().required(),
    }).required(),

})

module.exports.gayComicSchema = Joi.object({
    gayComic: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        // path: Joi.string().required(),
        filename: Joi.string(),
        series: Joi.number().required(),
        ordinality: Joi.number().required(),
    }).required(),

})


module.exports.comicSchema = Joi.object({
    comic: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        // path: Joi.string().required(),
        filename: Joi.string(),
    }).required(),

})


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


module.exports.gayCommentSchema = Joi.object({
    gayComment: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


module.exports.togetherCommentSchema = Joi.object({
    togetherComment: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})



