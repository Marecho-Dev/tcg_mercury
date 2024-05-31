import { db } from "~/server/db";
// import React, { useState } from "react";
// import CameraUploadButton from "./CameraUploadButton"; // Adjust the path as needed
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cards = await db.query.cards.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
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
        {[...cards, ...cards, ...cards].map((card, index) => (
          <div key={card.id + "-" + index} className="flex w-48 flex-col">
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
