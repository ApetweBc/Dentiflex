import React from 'react';

export default function Footer(){
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="p-4 text-center text-white bg-gray-800">
        <p>&copy; {currentYear} </p>
    </footer>
      
    );
}