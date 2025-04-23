import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";

import Dropzone from "@/Threejs/drop";
import { Inter } from "next/font/google";
import Three from "@/Threejs/three";

const inter = Inter({ subsets: ["latin"] });
const handleFilesAccepted = (files) => {
  files.forEach((file) => {
    if (file.name.endsWith(".stl")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const filePath = file.name;
        console.log("Filepath:", filePath);
        //  Want to store the file to the server
        //const nameOfFile = file.name;
        const formData = new FormData();
        formData.append("file", file);
        fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            const loadSTLEvent = new CustomEvent("loadSTL", {
              detail: { arrayBuffer, filePath: result.filePath },
            });
            document.dispatchEvent(loadSTLEvent);
            console.log("File uploaded successfully", result.filePath);
            toast.success("File uploaded successfully", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "colored",
              icon: false,
            });
          })
          .catch((error) => {
            toast.error("Failed to upload file", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "colored",
              icon: false,
            });
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Invalid file type, upload stl files", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        icon: false,
      });
    }
  });
};

export default function Viewer() {
  return (
    <main>
      <ToastContainer className={"z-50"} />
      <div className="absolute left-0 top-4 ">
        <Dropzone onFilesAccepted={handleFilesAccepted} />
      </div>
      <Three />
      {/* <Image
        src={logo}
        alt="logo"
        width={233}
        height={239}
        className="absolute bottom-4 right-10"
      /> */}
      {/* <Logo /> */}
      <div id="linkContainer" className="absolute bottom-4 left-10">
        <button id="generateLinkButton" className="px-3 text-white bg-lime-500">
          Generate Shareable Link
        </button>
        <button id="copyLinkButton" className="px-3 text-black bg-white">
          Copy Link
        </button>
        <div id="generatedLink" className="hidden Visibility:"></div>
      </div>
      <canvas id="myThreeJsCanva" />
    </main>
  );
}
