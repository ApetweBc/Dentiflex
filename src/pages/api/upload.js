import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  try {
    // Extract formData from the request
    const formData = await req.formData();
    const file = formData.get("file");

    // Check if a file was uploaded
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    // Convert file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "./public/uploads", filename);

    // Write the file to the server
    await writeFile(filePath, buffer);

    // Respond with a success message and the file path
    return NextResponse.json({ message: "Success", filePath: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    // Log and return error
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
  }
};

// import { promises as fsPromises } from 'fs';
// import multer from 'multer';
// import nextConnect from 'next-connect';
// import path from 'path';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => {
//       cb(null, file.originalname.replace(/ /g, '_')); // Replace spaces in filenames with underscores
//     },
//   }),
// });

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Sorry something went wrong! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// apiRoute.use(upload.single('file'));

// apiRoute.post(async (req, res) => {
//   res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, use multer instead
//   },
// };
