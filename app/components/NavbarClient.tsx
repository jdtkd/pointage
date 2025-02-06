"use client";

import { UserButton } from "@clerk/nextjs";

export default function NavbarClient() {
  return (
    <div className="navbar bg-base-100 lg:hidden">
      <div className="flex-none">
        <label htmlFor="main-drawer" className="btn btn-square btn-ghost drawer-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a className="text-xl font-bold">Pointage App</a>
      </div>
      <div className="flex-none">
        <UserButton 
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </div>
  );
} 