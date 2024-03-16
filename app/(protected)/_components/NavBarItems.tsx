"use client";
import Link from "next/link";
import React from "react";

export const SidebarItems = ({ userId }: { userId: string }) => {
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
          <Link
            href={`/orders/${userId}`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            New Orders
          </Link>
        </li>
        <li>
          <Link
            href={`/orders/records/${userId}`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            records
          </Link>
        </li>
      </ul>
    </>
  );
};

export const AdminSidebar = () => {
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
          Admin Panel
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
          <Link
            href={`/admin/user`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/news`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Add News
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/wallet `}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Client Invoices
          </Link>
        </li>
        <li>
          <a
            href={`/admin/orders`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Client Orders
          </a>
        </li>
        <AdminProducts />
      </ul>
    </>
  );
};

const AdminProducts = () => {
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
          Client Products
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
            href={`/admin/product `}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Add Product
          </a>
        </li>
        <li>
          <a
            href={`/admin/product/product-table`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Product Table
          </a>
        </li>
      </ul>
    </>
  );
};
