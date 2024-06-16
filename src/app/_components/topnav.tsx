"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export function TopNav() {
  const router = useRouter();

  const goToInventory = () => {
    router.push("/inventory"); // Update the path as per your route setup
  };
  const goToCardDumper = () => {
    router.push("/"); // Update the path as per your route setup
  };
  return (
    <nav className="flex w-full items-center justify-between p-5 text-xl font-semibold">
      <div>TCG Mercury</div>
      <div className="flex flex-row gap-4">
        <button
          onClick={goToCardDumper}
          className="rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Card Loader
        </button>
        <button
          onClick={goToInventory}
          className="rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Inventory
        </button>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
