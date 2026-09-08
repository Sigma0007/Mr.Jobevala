import multer from "multer";
import AppError from "../utils/AppError.js";

// Use memory storage so we can stream the file buffer directly to Cloudflare R2
const storage = multer.memoryStorage();

// File filter for images (profile avatar, logo, etc.)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new AppError("Only image files (JPG, PNG, WEBP, GIF) are allowed.", 400), false);
    }
};

// File filter for documents (resumes/CVs)
const documentFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ];

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        file.originalname.match(/\.(pdf|doc|docx|txt)$/i)
    ) {
        cb(null, true);
    } else {
        cb(new AppError("Only document files (PDF, DOC, DOCX) are allowed for resume.", 400), false);
    }
};

// Combined filter for image or document
const imageOrDocFilter = (req, file, cb) => {
    if (file.fieldname === "profileImage" || file.fieldname === "image" || file.fieldname === "logo") {
        return imageFilter(req, file, cb);
    }
    if (file.fieldname === "resume" || file.fieldname === "document" || file.fieldname === "file") {
        return documentFilter(req, file, cb);
    }
    cb(null, true);
};

export const uploadImage = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: imageFilter,
});

export const uploadResumeFile = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: documentFilter,
});

export const uploadProfileFiles = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: imageOrDocFilter,
});
