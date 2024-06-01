import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMyCards } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
// import React, { useState } from "react";
// import CameraUploadButton from "./CameraUploadButton"; // Adjust the path as needed
export const dynamic = "force-dynamic";
async function Cards() {
  const cards = await getMyCards();
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {cards.map((card) => (
        <div key={card.id} className="flex h-48 w-48 flex-col">
          <Link href={`/img/${card.id}`}>
            <Image
              src={card.url}
              style={{ objectFit: "contain" }}
              width={192}
              height={192}
              alt={card.url}
            />
          </Link>
          <div>{card.name}</div>
        </div>
      ))}
    </div>
  );
}
export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in above
        </div>
      </SignedOut>
      <SignedIn>
        <Cards />
      </SignedIn>
    </main>
  );
}
