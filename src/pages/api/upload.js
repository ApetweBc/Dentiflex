// import path from "path";
// import { writeFile } from "fs/promises";

// // Use edge runtime
// export const runtime = "edge";

// const handler = async (req) => {
//   if (req.method === "POST") {
//     try {
//       // Extract formData from the request
//       const formData = await req.formData();
//       const file = formData.get("file");

//       // Check if a file was uploaded
//       if (!file) {
//         return new Response(JSON.stringify({ error: "No files received." }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       // Convert file to a buffer
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = file.name.replace(/ /g, "_"); // Replace spaces with underscores
//       const filePath = path.join(process.cwd(), "public/uploads", filename); // Path to save the file

//       // Write the file to the server
//       await writeFile(filePath, buffer);

//       // Respond with a success message and the file path
//       return new Response(
//         JSON.stringify({ message: "Success", filePath: `/uploads/${filename}` }),
//         {
//           status: 201,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     } catch (error) {
//       // Log and return error
//       console.error("Error occurred:", error);
//       return new Response(JSON.stringify({ message: "Failed", error: error.message }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } else {
//     return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
//       status: 405,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// };

// export default handler;

// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";

// // Use nodejs runtime
// export const runtime = "nodejs";

// // Increase the body size limit to 50mb for this route
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '50mb',  // Adjust this value based on your needs
//     },
//   },
// };

// const handler = async (req) => {
//   if (req.method === "POST") {
//     try {
//       // Extract formData from the request
//       const formData = await req.formData();
//       const file = formData.get("file");

//       // Check if a file was uploaded
//       if (!file) {
//         return NextResponse.json({ error: "No files received." }, { status: 400 });
//       }

//       // Convert file to a buffer
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = file.name.replace(/ /g, "_"); // Replace spaces with underscores
      
//       // Use the public directory for uploads
//       const filePath = `./public/uploads/${filename}`; // Define the file path relative to public/uploads

//       // Write the file to the server
//       await writeFile(filePath, buffer);

//       return NextResponse.json({ message: "Success", filePath: `/uploads/${filename}` }, { status: 201 });
//     } catch (error) {
//       // Log and return error
//       console.error("Error occurred:", error);
//       return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
//     }
//   } else {
//     return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//   }
// };

// export default handler;
// Working Example
// import { IncomingForm } from "formidable";
// import path from "path";

// // Use nodejs runtime
// export const runtime = "nodejs";

// // Disable body parsing, as formidable will handle it
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req, res) => {
//   if (req.method === "POST") {
//     const form = new IncomingForm({
//       uploadDir: path.join(process.cwd(), "public/uploads"),
//       keepExtensions: true,
//       maxFileSize: 50 * 1024 * 1024, // 50MB
//     });

//     form.parse(req, (err, files) => {
//       if (err) {
//         console.error("Error occurred:", err);
//         return res.status(500).json({ message: "Failed", error: err.message });
//       }

//       const file = files.file;
//       if (!file) {
//         return res.status(400).json({ error: "No files received." });
//       }

//       // Get the current date and time
//       const currentTime = Date.now();
      
//       // Safely access originalFilename and check if it's a string
//       const filename = file.originalFilename && typeof file.originalFilename === 'string'
//         ? file.originalFilename.replace(/ /g, "_") // Replace spaces with underscores and add timestamp
//         : "default_filename"; // Fallback if originalFilename is undefined or not a string

//         // Add the timestamp to the filename
//         const timestampedFilename = `${currentTime}_${filename}`;

//       const filePath = path.join("/uploads", timestampedFilename);
//        console.log("The Uploaded file:", timestampedFilename);
//       return res.status(201).json({ message: "Success", filePath });
//     });
//   } else {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

// export default handler;

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
    form.on("fileBegin", (name, file) => {
      // Generate a timestamp
      const timestamp = Date.now();
      // Convert the timestamp to a readable date format
      const dateObject = new Date(timestamp);
      
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(dateObject.getDate()).padStart(2, '0');
      const hours = String(dateObject.getHours()).padStart(2, '0');
      const minutes = String(dateObject.getMinutes()).padStart(2, '0');
      const seconds = String(dateObject.getSeconds()).padStart(2, '0');
      
      // Format the date as YYYY_MM_DD_HH_MM_SS
      const formattedDate = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;

      // Safely get the original filename and remove spaces
      const originalFilename = file.originalFilename && typeof file.originalFilename === 'string'
        ? file.originalFilename.replace(/ /g, "_")
        : "default_filename";

     // Construct the custom filename
     const filename = `${formattedDate}_${originalFilename}`;

     // Define the full path where the file will be saved
     const uploadPath = path.join(process.cwd(), "public/uploads", filename);

     // Check if the directory exists, if not, create it
     if (!fs.existsSync(path.join(process.cwd(), "public/uploads"))) {
       fs.mkdirSync(path.join(process.cwd(), "public/uploads"), { recursive: true });
     }

     // Set the file's path
     file.filepath = uploadPath;

   }).parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "File parsing failed", error: err.message });
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
      return res.status(500).json({ message: "File path processing failed", error: error.message });
    }
  });
} else {
  return res.status(405).json({ error: "Method Not Allowed" });
}
};

export default handler;
