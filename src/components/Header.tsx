"use client";

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const pathname = usePathname();
  const router = useRouter();

  // Only fix the header on the home page
  const isHomePage = pathname === "/";
  const headerClasses = isHomePage
    ? "h-16 p-2 flex justify-between items-center z-50 backdrop-blur-md bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 shadow-lg"
    : "h-16 p-2 flex justify-between items-center z-50 backdrop-blur-md bg-indigo-600/40 border-b border-white/20 shadow-lg relative";

  return (
    <header className={headerClasses}>
      <Link href="/">
        <h1 className="text-2xl font-bold text-white">Cube Master</h1>
      </Link>

      <div>
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        ) : session ? (
          <Menu as="div" className="relative inline-block text-left z-50">
            <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-white" />
              )}
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-900 z-[9999]">
                <div className="px-4 py-3">
                  <p className="text-sm">Signed in as</p>
                  <p className="text-sm font-medium truncate ">
                    {session.user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        View Profile
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <Button
            onClick={() => router.push("/signin")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </header>
  );
}
