import {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();
import r2Client from "../config/r2Client.js";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Helper to extract key if a full URL is passed
export const extractR2Key = (keyOrUrl) => {
    if (!keyOrUrl || typeof keyOrUrl !== "string") return null;

    if (keyOrUrl.includes("/api/storage/file/")) {
        return keyOrUrl.split("/api/storage/file/")[1];
    }
    if (process.env.R2_PUBLIC_URL && keyOrUrl.includes(process.env.R2_PUBLIC_URL)) {
        return keyOrUrl.replace(`${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/`, "");
    }
    if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
        try {
            const urlObj = new URL(keyOrUrl);
            return urlObj.pathname.replace(/^\/+/, "");
        } catch {
            return keyOrUrl;
        }
    }
    return keyOrUrl;
};

// Helper to generate public/accessible URL for a key
export const getR2PublicUrl = (key) => {
    if (!key) return "";
    if (process.env.R2_PUBLIC_URL) {
        return `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
    }
    return `/api/storage/file/${key}`;
};

// Upload file to Cloudflare R2
export const uploadToR2 = async ({
    buffer,
    key,
    contentType,
}) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    await r2Client.send(command);

    const publicUrl = getR2PublicUrl(key);

    return {
        key,
        url: publicUrl,
    };
};

// Delete file from Cloudflare R2
export const deleteFromR2 = async (keyOrUrl) => {
    const key = extractR2Key(keyOrUrl);
    if (!key) return;

    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2Client.send(command);
    } catch (error) {
        console.error("Error deleting from R2:", error.message);
    }
};

// Get file object stream from Cloudflare R2
export const getFileStreamFromR2 = async (key) => {
    const cleanKey = extractR2Key(key);
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: cleanKey,
    });

    const response = await r2Client.send(command);
    return response;
};

// Generate temporary signed URL
export const getSignedR2Url = async (key, expiresIn = 3600) => {
    const cleanKey = extractR2Key(key);
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: cleanKey,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
};