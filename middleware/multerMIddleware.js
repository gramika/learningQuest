const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split('.').pop();

        const safeTitle = req.body.title
            ? req.body.title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim()
            : `note-${Date.now()}`;

        callback(null, `${safeTitle}-${Date.now()}.${ext}`);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Only PDF, DOC, and PPT files are allowed"), false);
    }
};

const multerConfig = multer({
    storage,
    fileFilter
});

module.exports = multerConfig;
