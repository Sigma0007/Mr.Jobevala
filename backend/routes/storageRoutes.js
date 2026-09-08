import express from "express";
import { getFileStreamFromR2 } from "../utils/r2Storage.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

// @desc    Serve or stream file from Cloudflare R2
// @route   GET /api/storage/file/...
// @access  Public
router.get(
    /^\/file\/(.+)/,
    catchAsync(async (req, res, next) => {
        // req.params[0] captures everything after /file/
        const rawKey = req.params[0] || req.path.replace(/^\/file\//, "");
        if (!rawKey) {
            return next(new AppError("File key is required", 400));
        }

        try {
            const r2Object = await getFileStreamFromR2(rawKey);

            if (r2Object.ContentType) {
                res.setHeader("Content-Type", r2Object.ContentType);
            }
            if (r2Object.ContentLength) {
                res.setHeader("Content-Length", r2Object.ContentLength);
            }
            if (r2Object.ETag) {
                res.setHeader("ETag", r2Object.ETag);
            }

            // Cache headers (1 day cache)
            res.setHeader("Cache-Control", "public, max-age=86400");

            // For inline display (like images & PDFs in browser)
            const filename = rawKey.split("/").pop();
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${encodeURIComponent(filename)}"`
            );

            // Pipe stream to response
            if (r2Object.Body && typeof r2Object.Body.pipe === "function") {
                r2Object.Body.pipe(res);
            } else if (r2Object.Body && typeof r2Object.Body.transformToByteArray === "function") {
                const byteArray = await r2Object.Body.transformToByteArray();
                res.end(Buffer.from(byteArray));
            } else {
                return next(new AppError("Unable to read file stream from storage", 500));
            }
        } catch (error) {
            if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
                return next(new AppError("File not found in storage", 404));
            }
            console.error("Storage route error:", error);
            return next(new AppError("Failed to retrieve file from storage", 500));
        }
    })
);

export default router;
