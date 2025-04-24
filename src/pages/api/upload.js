// This API route handles file uploads using formidable

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

// Use nodejs runtime
export const runtime = "nodejs";

// Disable body parsing, as formidable will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    // Use fileBegin to customize the file's name
    form
      .on("fileBegin", (name, file) => {
        // Generate a timestamp
        const timestamp = Date.now();
        // Convert the timestamp to a readable date format
        const dateObject = new Date(timestamp);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");
        const seconds = String(dateObject.getSeconds()).padStart(2, "0");

        // Format the date as YYYY_MM_DD_HH_MM_SS
        const formattedDate = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;

        // Safely get the original filename and remove spaces
        const originalFilename =
          file.originalFilename && typeof file.originalFilename === "string"
            ? file.originalFilename.replace(/ /g, "_")
            : "default_filename";

        // Construct the custom filename
        const filename = `${formattedDate}_${originalFilename}`;

        // Define the full path where the file will be saved
        const uploadPath = path.join(process.cwd(), "public/uploads", filename);

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(path.join(process.cwd(), "public/uploads"))) {
          fs.mkdirSync(path.join(process.cwd(), "public/uploads"), {
            recursive: true,
          });
        }

        // Set the file's path
        file.filepath = uploadPath;
      })
      .parse(req, (err, fields, files) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "File parsing failed", error: err.message });
        }

        const file = files.file;
        if (!file) {
          return res.status(400).json({ error: "No file received." });
        }

        // Ensure file has been uploaded
        if (!file[0].filepath) {
          return res.status(500).json({ error: "Filepath not set properly." });
        }

        try {
          // Ensure file path is a valid string
          const filePath = `/uploads/${path.basename(file[0].filepath)}`;
          return res.status(201).json({ message: "Success", filePath });
        } catch (error) {
          return res.status(500).json({
            message: "File path processing failed",
            error: error.message,
          });
        }
      });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
