const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../../config/cloudinary');
const cloudinary=require('../../config/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpeg', 'jpg', 'png'],
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

module.exports = upload;
