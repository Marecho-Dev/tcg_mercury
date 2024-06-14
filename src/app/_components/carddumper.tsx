"use client";
import React, { useState, useRef } from "react";
import { uploadFiles } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UploadResponse {
  customId: string | null;
  key: string;
  name: string;
  serverData: {
    uploadedBy: string;
  };
  size: number;
  type: string;
  url: string;
}

export function CardDumper() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [tempImages, setTempImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setTempImages([...tempImages, ...Array.from(files)]);
    }
  };

  const handleConfirmUpload = async () => {
    setIsUploading(true);
    try {
      const res = await uploadFiles("imageUploader", {
        files: tempImages,
        // input: {}, // Add any necessary input data here
      });
      setTempImages([]);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log(res);
      router.refresh();
    } catch (error) {
      setIsUploading(false);
      if (error instanceof Error) {
        alert(`ERROR! ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {tempImages.length > 0 && (
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          {tempImages.map((file, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg">
              <h3 className="bg-gray-800 p-2 text-center text-lg font-bold text-white">
                Image {index + 1}
              </h3>
              <Image
                src={URL.createObjectURL(file)}
                style={{ objectFit: "contain" }}
                width={192}
                height={192}
                alt={file.name}
              />
            </div>
          ))}
        </div>
      )}
      {tempImages.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            className={`rounded-lg px-4 py-2 font-semibold text-white ${
              isUploading
                ? "cursor-not-allowed bg-gray-500"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleConfirmUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
