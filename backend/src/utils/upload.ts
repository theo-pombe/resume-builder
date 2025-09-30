import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { Request } from "express";

// get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// sanitize filename: replace spaces and non-alphanumeric chars
const sanitizeFilename = (name: string) => {
  return name
    .trim()
    .replace(/\s+/g, "_") // replace spaces with _
    .replace(/[^a-zA-Z0-9-_]/g, ""); // remove other special chars
};

// configure storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = sanitizeFilename(name);
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

// optional: filter only images
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

// reusable multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
