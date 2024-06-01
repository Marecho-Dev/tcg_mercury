import { db } from "~/server/db";
import { getMyCards } from "~/server/queries";
// import React, { useState } from "react";
// import CameraUploadButton from "./CameraUploadButton"; // Adjust the path as needed
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cards = await getMyCards();
  //   // const [image, setImage] = useState<string | null>(null);

  //   // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   //   const file = event.target.files?.[0];
  //   //   if (file) {
  //   //     const reader = new FileReader();
  //   //     reader.onload = (e) => {
  //   //       setImage(e.target?.result as string);
  //   //     };
  //   //     reader.readAsDataURL(file);
  //   //   }
  //   // };

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {cards.map((card) => (
          <div key={card.id} className="flex w-48 flex-col">
            <img src={card.url} />
            <div> {card.name}</div>
          </div>
        ))}
      </div>
      {/* <CameraUploadButton onFileChange={handleFileChange} />
//       {image && (
//         <img
//           src={image}
//           alt="Uploaded"
//           style={{ width: "300px", height: "auto" }}
//         />
//       )} */}
    </main>
  );
}
