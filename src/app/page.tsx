"use client"; // Add this line at the top

import Link from "next/link";
import React, { useState } from "react";
import CameraUploadButton from "./CameraUploadButton"; // Adjust the path as needed
const HomePage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Hello Gallery</h1>
      <CameraUploadButton onFileChange={handleFileChange} />
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ width: "300px", height: "auto" }}
        />
      )}
    </main>
  );
};

export default HomePage;
