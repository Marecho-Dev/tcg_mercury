import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
// import { UploadButton } from "../utils/uploadthing";
import { CardDumper } from "./_components/carddumper";

// import React, { useState } from "react";
// import CameraUploadButton from "./CameraUploadButton"; // Adjust the path as needed
export const dynamic = "force-dynamic";
// async function Images() {
//   const images = await getMyImages();
//   return (
//     <div className="flex flex-wrap justify-center gap-4 p-4">
//       {images.map((image) => (
//         <div key={image.id} className="flex h-48 w-48 flex-col">
//           <Link href={`/img/${image.id}`}>
//             <Image
//               src={image.url}
//               style={{ objectFit: "contain" }}
//               width={192}
//               height={192}
//               alt={image.url}
//             />
//           </Link>
//           <div>{image.name}</div>
//         </div>
//       ))}
//     </div>
//   );
// }
export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in above
        </div>
      </SignedOut>
      <SignedIn>
        <CardDumper />
      </SignedIn>
    </main>
  );
}
