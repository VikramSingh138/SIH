import { useState, useEffect } from "react";
import axios from "axios";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/accept`);
      localStorage.setItem("cookieAccepted", "true");
      setVisible(false);
    } catch (err) {
      console.error("Error updating user count:", err);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 flex justify-between items-center">
      <p>This site uses cookies to enhance user experience.</p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Accept
      </button>
    </div>
  );
}
