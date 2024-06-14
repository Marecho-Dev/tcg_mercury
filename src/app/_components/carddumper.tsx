"use client";
import React, { useState } from "react";

import { UploadButton } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
    if (images.length === 1 && res.length === 1) {
      setImages([...images, ...res]); // Append new image to existing one
    } else {
      setImages(res); // Replace images with new image(s)
    }
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
            <Image
              src={images[0]?.url ?? "path/to/default/image.jpg"}
              style={{ objectFit: "contain" }}
              width={192}
              height={192}
              alt={images[0]?.name ?? "Default Image"}
            />
          </div>
          {images.length > 1 && (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <h3 className="bg-gray-800 p-2 text-center text-lg font-bold text-white">
                Back
              </h3>
              <Image
                src={images[1]?.url ?? "path/to/default/image.jpg"}
                style={{ objectFit: "contain" }}
                width={192}
                height={192}
                alt={images[1]?.name ?? "Default Image"}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
