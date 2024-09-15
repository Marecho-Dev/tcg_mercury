"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { uploadFiles } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { readAndCompressImage } from "browser-image-resizer";

const resizeConfig = {
  quality: 0.7,
  maxWidth: 1366,
  maxHeight: 768,
  width: 1366,
  height: 768,
  autoRotate: true,
  debug: true,
  mode: "cover" as const,
};

interface CardDetails {
  id: number;
  url?: string;
  status?: string;
}

async function resizeImage(file: File): Promise<File> {
  try {
    const resizedBlob = await readAndCompressImage(file, resizeConfig);
    return new File([resizedBlob], file.name, { type: resizedBlob.type });
  } catch (error) {
    console.error("Error resizing image:", error);
    return file;
  }
}

export function CardDumper() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadQueue, setUploadQueue] = useState<File[][]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const uploadImages = useCallback(
    async (images: File[]) => {
      try {
        const createdCardResponse = await fetch("/api/createCard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!createdCardResponse.ok) {
          throw new Error(`HTTP error! Status: ${createdCardResponse.status}`);
        }

        const data = (await createdCardResponse.json()) as CardDetails[];
        const cardId = data[0]?.id;

        if (!cardId) {
          throw new Error("Failed to get card ID");
        }

        const res = await uploadFiles("imageUploader", { files: images });

        const updatedImageIds = res
          .map((item) => item.serverData.pictureId)
          .filter((id): id is number => id !== null);
        const updatedImageUrls = res
          .map((item) => item.serverData.pictureUrl)
          .filter((url): url is string => url !== null && url !== undefined);

        await fetch("/api/updateImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageIds: updatedImageIds, cardId }),
        });

        await fetch("/api/updateCardImages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId,
            picture1Url: updatedImageUrls[0],
            picture2Url: updatedImageUrls[1],
          }),
        });

        router.refresh();
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    },
    [router],
  );

  useEffect(() => {
    const processUploadQueue = async () => {
      if (uploadQueue.length > 0 && !isUploading) {
        setIsUploading(true);
        const currentUpload = uploadQueue[0];

        if (currentUpload) {
          try {
            await uploadImages(currentUpload);
            setUploadQueue((prevQueue) => prevQueue.slice(1));
          } catch (error) {
            console.error("Upload failed:", error);
          }
        }

        setIsUploading(false);
      }
    };

    void processUploadQueue();
  }, [uploadQueue, isUploading, uploadImages]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const resizedFiles = await Promise.all(
        Array.from(files)
          .slice(0, 2)
          .map((file) => resizeImage(file)),
      );
      setSelectedImages(resizedFiles);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedImages.length === 2) {
      setUploadQueue((prevQueue) => [...prevQueue, selectedImages]);
      setSelectedImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
        max={2}
      />
      {selectedImages.length > 0 && (
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          {selectedImages.map((file, index) => (
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
      <div className="mt-4 flex justify-center">
        <button
          className={`rounded-lg px-4 py-2 font-semibold text-white ${
            selectedImages.length === 2
              ? "bg-blue-500 hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-500"
          }`}
          onClick={handleConfirmUpload}
          disabled={selectedImages.length !== 2}
        >
          Confirm Upload
        </button>
      </div>
      {uploadQueue.length > 0 && (
        <div className="mt-4 text-center">
          <p>{`Uploads in queue: ${uploadQueue.length}`}</p>
          {isUploading && <p>Uploading...</p>}
        </div>
      )}
    </div>
  );
}
