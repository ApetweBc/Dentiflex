// pages/api/upload.js

import { IncomingForm } from "formidable";
import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import { runCorsMiddleware } from "./cors";

// Disable body parsing as formidable will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

// Set up AWS S3
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ...existing code...

export default async function handler(req, res) {
  // Check if Method is allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Run CORS middleware
  await runCorsMiddleware(req, res);

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File parsing failed", error: err.message });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "No file received" });
    }

    // Generate formatted timestamp
    const dateObject = new Date();
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;

    // Clean filename and add timestamp
    const originalFilename =
      file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, "_") ||
      "default_filename";
    const filename = `${formattedDate}_${originalFilename}`;

    try {
      // Check if file exists and is readable
      if (!fs.existsSync(file.filepath)) {
        throw new Error("Temporary file not found");
      }

      const fileContent = fs.readFileSync(file.filepath);

      // Verify AWS credentials are set
      if (
        !process.env.AWS_ACCESS_KEY_ID ||
        !process.env.AWS_SECRET_ACCESS_KEY ||
        !process.env.S3_BUCKET_NAME
      ) {
        throw new Error("AWS credentials or bucket name not configured");
      }

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${filename}`, // Add uploads folder for better organization
        Body: fileContent,
        ContentType: file.mimetype || "application/octet-stream",
        // ACL: "public-read",
      };

      const s3Response = await s3.upload(uploadParams).promise();

      // Clean up temporary file
      fs.unlinkSync(file.filepath);

      return res.status(201).json({
        message: "Uploaded to S3",
        fileUrl: s3Response.Location,
        fileName: filename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        error: "Upload failed",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
}
