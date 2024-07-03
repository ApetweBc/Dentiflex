import { toast } from "react-toastify";

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

export default handleFilesAccepted;
