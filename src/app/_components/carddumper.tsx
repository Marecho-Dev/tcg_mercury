"use client";
import React, { useState, useRef, useEffect } from "react";
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

interface CardDetails {
  id: number;
  // Add other expected properties here
  url?: string; // Using optional if not all cards have a URL
  status?: string; // Optional if not all cards have a status
}

export function CardDumper() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImages, setTempImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [cardData, setCardData] = useState<number | null>(null);

  useEffect(() => {
    if (cardData) {
      console.log("Updated cardData:", cardData);
      // Perform any other actions that depend on the updated cardData value
    }
  }, [cardData]);

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setTempImages([...tempImages, ...Array.from(files)]);
    }
  };

  const handleConfirmUpload = async () => {
    setIsUploading(true);

    try {
      // Create the card first
      console.log(
        "Requesting URL:",
        window.location.origin + "/api/createCard",
      );
      const createdCardResponse = await fetch("/api/createCard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
      });

      if (!createdCardResponse.ok) {
        throw new Error(`HTTP error! Status: ${createdCardResponse.status}`);
      }

      const data = (await createdCardResponse.json()) as CardDetails[];
      console.log(data);
      setCardData(data[0]!.id);
      console.log("testing");
      console.log(createdCardResponse);
      console.log("calling CardId");
      console.log(cardData);

      // Upload the images associated with the created card
      const res = await uploadFiles("imageUploader", {
        files: tempImages,
        // input: { cardId }, // Pass the cardId as input data to the uploadFiles function
      });
      console.log("upload files finished calling");
      console.log(res);
      const updatedImageIds = res
        .map((item) => item.serverData.pictureId)
        .filter((id): id is number => id !== null); // Filter out null values
      const updatedImageUrls = res
        .map((item) => item.serverData.pictureUrl) // Access the pictureUrl from each item
        .filter((url): url is string => url !== null && url !== undefined); // Filter out null or undefined URLs

      console.log("whatever this is");
      console.log(updatedImageIds);
      console.log(updatedImageUrls);
      // console.log(data[0].id);
      console.log("end whathever this is");

      const updateImageResponse = await fetch("/api/updateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify({
          imageIds: updatedImageIds,
          cardId: data[0]!.id,
        }),
      });

      if (!createdCardResponse.ok) {
        throw new Error(`HTTP error! Status: ${updateImageResponse.status}`);
      }

      // if (!updateSuccess) {
      //   throw new Error("Failed to update images with cardId");
      // }
      //updatedImageIds contains the updatedImagesIds [37, 38] you can make it so a new updateCardImages calls for
      console.log("updateImageResponse");
      console.log(updateImageResponse);
      console.log("--------------------------");

      const updateCardImages = await fetch("/api/updateCardImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify({
          cardId: data[0]!.id,
          picture1Url: updatedImageUrls[0],
          picture2Url: updatedImageUrls[1],
        }),
      });

      if (!createdCardResponse.ok) {
        throw new Error(`HTTP error! Status: ${updateImageResponse.status}`);
      }

      console.log("updatedCardImages");
      console.log(updateCardImages);
      console.log("--------------------------");

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
