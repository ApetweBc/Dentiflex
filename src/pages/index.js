import "react-toastify/dist/ReactToastify.css";

import Layout from "@/components/layout";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Layout>
        {/* Main Content Area */}
        

<div className="flex flex-col-reverse bg-white md:flex-row">
  <div className="p-4 m-3 md:basis-3/4">
    <h1 className="my-3 text-4xl text-center text-gray-900">
      Welcome to our Free Dental STL Viewer
    </h1>
    <h2 className="text-2xl text-center">
      Your ultimate tool for managing and sharing STL files with ease
    </h2>
    <hr className="my-2 bg-gray-800 border-b-2" />
    <p>
      Our free Dental STL Viewer is a user-friendly tool that allows you to view,
      analyze, and share your STL files with ease. Whether you’re a dentist,
      orthodontist, or dental technician, our viewer is the perfect solution for
      managing your dental STL files.
    </p>
    <ul className="m-3 list-disc">
      <li>Easily view and analyze your STL files.</li>
      <li>Measure distances, angles, and areas.</li>
      <li>Share your files with colleagues and clients.</li>
      <li>Compatible with all major browsers and operating systems.</li>
      <li>Access your files from anywhere, at any time.</li>
    </ul>
  </div>
  <div className="m-3 bg-blue-400 basis-full md:basis-1/4">lorem</div>
</div>
<div className="flex justify-center bg-white md:flex-row">
  <div className="flex justify-center m-3 md:basis-full">
    <Link href="/viewer">
      <button className="p-4 m-3 bg-gray-800 rounded-sm">
        <span className="text-center text-white">Access Viewer</span>
      </button>
    </Link>
  </div>
  <div className="md:basis-1/4"></div>
</div>
<div className="md:basis-full"></div>

      </Layout>
    </main>
  );
}
