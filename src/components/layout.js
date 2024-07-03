import Footer from "./footer";
import Navigation from "./navigation";
import React from "react";

export default function Layout({ children }) {
const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col min-h-svh">
        <Navigation />
        <main className="flex-grow ">{children}</main>
          <Footer />
        </div>
    );
    }
    