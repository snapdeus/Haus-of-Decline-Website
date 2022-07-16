const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'comics',
        allowedFormats: ['jpeg', 'jpg'],
        // type: 'private',
        width: 450,
        tags: (req, file) => JSON.stringify(req.body.tag),



    }
});

module.exports = {
    cloudinary,
    storage
}
