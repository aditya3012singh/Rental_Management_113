import React, { useState } from "react";
import { Package } from "lucide-react";

const DamageChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Upload file to backend and get prediction
  const handleCheckDamage = async () => {
    if (!file) return alert("Please select an image or video");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect-damage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setResult("Error: " + data.error);
      } else if (data.message) {
        setResult(data.message);
      } else {
        setResult("No result");
      }
    } catch (error) {
      setResult("Failed to fetch result");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center">
      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Phone Damage Checker</h2>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          {file?.type.startsWith("video") ? (
            <video
              src={preview}
              controls
              className="mx-auto max-h-64 rounded-md"
            />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="mx-auto max-h-64 rounded-md"
            />
          )}
        </div>
      )}

      <button
        disabled={loading}
        onClick={handleCheckDamage}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Damage"}
      </button>

      {result && (
        <p className="mt-4 text-lg font-semibold text-gray-700">{result}</p>
      )}
    </div>
  );
};

export default DamageChecker;
