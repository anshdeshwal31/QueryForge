"use client"

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="w-full flex justify-center px-4">
      <nav className="w-full max-w-4xl md:w-[50vw] flex items-center justify-between px-4 md:px-8 py-3 bg-black-100/10 absolute z-30 backdrop-blur-md rounded-full mt-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-lg">⚡</span>
          </div>
          <span className="text-xl md:text-2xl font-semibold text-white">
            QueryForge
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="#"
            className="hidden sm:block text-gray-300 hover:text-purple-400 transition-colors"
          >
            Home
          </a>
          

          {/* Auth Section */}
          <SignedOut>
            <SignInButton>
              <button className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm md:text-base">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
