import Layout from "@/components/layout";
import { useState, useEffect } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Layout>
      <div>
        <p>Settings Color</p>
        <div className="theme-toggle">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            Dark Mode
          </label>
        </div>
      </div>
    </Layout>
  );
}
