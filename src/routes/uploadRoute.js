import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

dotenv.config();

export const uploadRoute = Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a product image
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */

uploadRoute.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // Upload a file buffer to Cloudinary
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          // Convert the file buffer into a readable stream
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);

      return res.status(201).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      return res.status(500).json({
        message: "Server error while uploading image",
      });
    }
  },
);

uploadRoute.get("/:publicId", protect, adminOnly, async (req, res) => {
  try {
    const result = await cloudinary.api.resource(req.params.publicId);

    res.json(result);
  } catch (error) {
    res.status(404).json({
      message: "Image not found",
    });
  }
});

uploadRoute.put(
  "/:publicId",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      await cloudinary.uploader.destroy(req.params.publicId);

      const uploadImage = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );

          if (!req.file) {
            return res.status(400).json({
              message: "No image uploaded",
            });
          }

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadImage();

      res.json({
        message: "Image updated",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Update failed",
      });
    }
  },
);

uploadRoute.delete(
  "/products/:publicId",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      await cloudinary.uploader.destroy(req.params.publicId);

      res.json({
        message: "Image deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Delete failed",
      });
    }
  },
);
