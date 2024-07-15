import Footer from "./footer";
import Navigation from "./navigation";
import React from "react";

export default function Layout({ children }) {


    return (
        <div className="flex flex-col bg-white min-h-svh">
        <Navigation />
        <main className="flex-grow ">{children}</main>
          <Footer />
        </div>
    );
    }
    