"use client";
import React from "react";

export const SidebarItems = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Order
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <a
            href="#"
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            New Orders
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            records
          </a>
        </li>
      </ul>
    </>
  );
};
