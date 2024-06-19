import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";

import Dropzone from "@/Threejs/drop";
import Image from "next/image";
import { Inter } from "next/font/google";
import Three from "@/Threejs/three";
import logo from "../../public/aurum.png";

const inter = Inter({ subsets: ["latin"] });
const handleFilesAccepted = (files) => {
  files.forEach((file) => {
    if (file.name.endsWith(".stl")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        document.dispatchEvent(
          new CustomEvent("loadSTL", { detail: contents })
        );
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

export default function Home() {
  return (
    <main>
      <ToastContainer className={"z-50"} />
       <div className="absolute left-0 top-4 ">
      <Dropzone onFilesAccepted={handleFilesAccepted}  />

       </div>
      <Three />
      <Image
        src={logo}
        alt="logo"
        width={233}
        height={239}
        className="absolute bottom-4 right-10"
      />
      <canvas id="myThreeJsCanva" />
    </main>
  );
}
