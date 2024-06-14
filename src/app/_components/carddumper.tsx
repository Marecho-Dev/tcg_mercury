"use client";
import React, { useState } from "react";

import { UploadButton } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [images, setImages] = useState<UploadResponse[]>([]);

  const handleUploadComplete = (res: UploadResponse[]) => {
    console.log(res);
    setImages(res);
    router.refresh();
  };
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
      />
      {images.length > 0 && (
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <h3 className="bg-gray-800 p-2 text-center text-lg font-bold text-white">
              Front
            </h3>
            <img
              src={images[0].url}
              alt={images[0].name}
              className="h-48 w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <h3 className="bg-gray-800 p-2 text-center text-lg font-bold text-white">
                Back
              </h3>
              <img
                src={images[1].url}
                alt={images[1].name}
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
